<?php
// Include configuration
require_once __DIR__ . '/config.php';

// We connect manually without selecting a database first to ensure it exists (if supported by DB_USER permissions)
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // If permission denied to create DB, we assume the user already created it via cPanel/Control Panel.
    // We will just proceed and let the PDO connection in getDBConnection handle it.
}

// Get standard connection to the configured database
$db = getDBConnection();

$response = ["status" => "success", "messages" => []];

try {
    // 1. Create Users Table
    $db->exec("CREATE TABLE IF NOT EXISTS `users` (
        `username` VARCHAR(50) PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(100) NOT NULL,
        `bio` TEXT DEFAULT NULL,
        `avatar` TEXT DEFAULT NULL,
        `password` VARCHAR(255) NOT NULL,
        `role` VARCHAR(20) NOT NULL DEFAULT 'mahasiswa'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    $response["messages"][] = "Table 'users' verified/created successfully.";

    // 2. Create Products Table
    $db->exec("CREATE TABLE IF NOT EXISTS `products` (
        `id` VARCHAR(100) PRIMARY KEY,
        `name` VARCHAR(150) NOT NULL,
        `category` VARCHAR(50) NOT NULL,
        `subcategory` VARCHAR(50) NOT NULL,
        `description` TEXT NOT NULL,
        `image` TEXT NOT NULL,
        `author` VARCHAR(100) NOT NULL,
        `nim` VARCHAR(50) DEFAULT NULL,
        `jurusan` VARCHAR(100) DEFAULT NULL,
        `featured` TINYINT(1) NOT NULL DEFAULT 0,
        `price` INT DEFAULT NULL,
        `createdAt` BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    $response["messages"][] = "Table 'products' verified/created successfully.";

    // 3. Create Submissions Table
    $db->exec("CREATE TABLE IF NOT EXISTS `submissions` (
        `id` VARCHAR(100) PRIMARY KEY,
        `name` VARCHAR(150) NOT NULL,
        `nim` VARCHAR(50) NOT NULL,
        `author` VARCHAR(100) NOT NULL,
        `jurusan` VARCHAR(100) NOT NULL,
        `category` VARCHAR(50) NOT NULL,
        `subcategory` VARCHAR(50) NOT NULL,
        `description` TEXT NOT NULL,
        `price` INT DEFAULT NULL,
        `image` TEXT NOT NULL,
        `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
        `rejectionReason` TEXT DEFAULT NULL,
        `createdAt` BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    $response["messages"][] = "Table 'submissions' verified/created successfully.";

    // 4. Create Settings Table
    $db->exec("CREATE TABLE IF NOT EXISTS `settings` (
        `key_name` VARCHAR(50) PRIMARY KEY,
        `val_value` TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    $response["messages"][] = "Table 'settings' verified/created successfully.";

    // --- SEED DEFAULT DATA ---

    // Seed Admin if not exists
    $stmt = $db->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = 'admin'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        // Simple plaintext or hashed password. We support both.
        // Let's store password as is or md5 or password_hash. Let's use simple plaintext for ease of migration matching the previous code: "kata sandi bawaan admin adalah 'admin'"
        $adminInsert = $db->prepare("INSERT INTO `users` (`username`, `name`, `email`, `bio`, `password`, `role`) VALUES ('admin', 'Administrator Utama', 'admin@nfdigital.ac.id', 'Administrator Utama Portal NF Katalog', 'admin', 'admin')");
        $adminInsert->execute();
        $response["messages"][] = "Default admin user seeded successfully.";
    }

    // Seed default settings: initial budget
    $stmt = $db->prepare("SELECT COUNT(*) FROM `settings` WHERE `key_name` = 'admin_initial_budget'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $budgetInsert = $db->prepare("INSERT INTO `settings` (`key_name`, `val_value`) VALUES ('admin_initial_budget', '100000000')");
        $budgetInsert->execute();
        $response["messages"][] = "Default budget setting seeded successfully.";
    }

    // Seed Default Products if empty
    $stmt = $db->prepare("SELECT COUNT(*) FROM `products`");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        // We compile some default products matching productsStore.ts
        $defaultProducts = [
            [
                "id" => "notion-life-planner-2024",
                "name" => "Notion Life Planner 2024",
                "category" => "Template",
                "subcategory" => "Notion",
                "description" => "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
                "image" => "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", // Fallback web path
                "author" => "Fakultas Bisnis Digital",
                "nim" => "ADMIN",
                "jurusan" => "Bisnis Digital",
                "featured" => 1,
                "price" => null,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 12
            ],
            [
                "id" => "ultimate-lightroom-presets",
                "name" => "Ultimate Lightroom Presets",
                "category" => "Preset & Filter",
                "subcategory" => "Lightroom",
                "description" => "50+ Preset estetik untuk foto Instagram yang lebih kece.",
                "image" => "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800",
                "author" => "Mahasiswa BD",
                "nim" => "1202021001",
                "jurusan" => "Bisnis Digital",
                "featured" => 0,
                "price" => 45000,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 11
            ],
            [
                "id" => "ebook-jago-freelance",
                "name" => "E-Book: Jago Freelance",
                "category" => "E-Book & Panduan",
                "subcategory" => "Bisnis",
                "description" => "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
                "image" => "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
                "author" => "Himpunan Mahasiswa",
                "nim" => "1202021002",
                "jurusan" => "Bisnis Digital",
                "featured" => 0,
                "price" => 69000,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 10
            ],
            [
                "id" => "saas-ui-kit-figma",
                "name" => "SaaS UI Kit Figma",
                "category" => "UI/UX Kit",
                "subcategory" => "Figma",
                "description" => "Kumpulan komponen UI modern untuk desain aplikasi web.",
                "image" => "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800",
                "author" => "Alumni Bisnis Digital",
                "nim" => "ADMIN",
                "jurusan" => "Bisnis Digital",
                "featured" => 1,
                "price" => null,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 9
            ],
            [
                "id" => "social-media-templates",
                "name" => "Social Media Templates",
                "category" => "Template",
                "subcategory" => "Canva",
                "description" => "100+ template Instagram, TikTok, dan YouTube siap pakai.",
                "image" => "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
                "author" => "Zacky Maulana",
                "nim" => "1202021005",
                "jurusan" => "Bisnis Digital",
                "featured" => 0,
                "price" => 35000,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 8
            ],
            [
                "id" => "video-editing-course",
                "name" => "Video Editing Course",
                "category" => "Video & Kursus",
                "subcategory" => "Premiere Pro",
                "description" => "Kursus lengkap editing video dari dasar hingga mahir.",
                "image" => "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800",
                "author" => "Dosen Pembimbing",
                "nim" => "ADMIN",
                "jurusan" => "Bisnis Digital",
                "featured" => 0,
                "price" => null,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 7
            ],
            [
                "id" => "react-component-library",
                "name" => "React Component Library",
                "category" => "Source Code",
                "subcategory" => "React",
                "description" => "50+ komponen React siap pakai untuk proyek web modern.",
                "image" => "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
                "author" => "Lab Komputer STT NF",
                "nim" => "ADMIN",
                "jurusan" => "Teknik Informatika",
                "featured" => 0,
                "price" => 150000,
                "createdAt" => time() * 1000 - 1000 * 60 * 60 * 24 * 6
            ]
        ];

        $prodInsert = $db->prepare("INSERT INTO `products` (`id`, `name`, `category`, `subcategory`, `description`, `image`, `author`, `nim`, `jurusan`, `featured`, `price`, `createdAt`) VALUES (:id, :name, :category, :subcategory, :description, :image, :author, :nim, :jurusan, :featured, :price, :createdAt)");
        
        foreach ($defaultProducts as $p) {
            $prodInsert->execute($p);
        }
        $response["messages"][] = "Default products seeded successfully.";
    }

    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database setup failed: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
