<?php
// Include configuration
require_once __DIR__ . '/config.php';

// Get database connection
$db = getDBConnection();

// Read input JSON for POST requests
$inputData = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? $inputData['action'] ?? '';

switch ($action) {

    // --- PRODUCTS ---
    case 'get_products':
        try {
            $stmt = $db->query("SELECT * FROM `products` ORDER BY `createdAt` DESC");
            $products = $stmt->fetchAll();
            // Format types
            foreach ($products as &$p) {
                $p['featured'] = (bool)$p['featured'];
                $p['price'] = $p['price'] !== null ? (int)$p['price'] : null;
                $p['createdAt'] = (float)$p['createdAt'];
            }
            echo json_encode($products);
        } catch (PDOException $e) {
            sendError("Failed to fetch products", $e->getMessage());
        }
        break;

    case 'save_product':
        try {
            $id = $inputData['id'] ?? '';
            $name = $inputData['name'] ?? '';
            $category = $inputData['category'] ?? '';
            $subcategory = $inputData['subcategory'] ?? '';
            $description = $inputData['description'] ?? '';
            $image = $inputData['image'] ?? '';
            $author = $inputData['author'] ?? '';
            $nim = $inputData['nim'] ?? null;
            $jurusan = $inputData['jurusan'] ?? null;
            $featured = isset($inputData['featured']) ? (int)$inputData['featured'] : 0;
            $price = isset($inputData['price']) && $inputData['price'] !== '' && $inputData['price'] !== null ? (int)$inputData['price'] : null;
            $createdAt = $inputData['createdAt'] ?? (time() * 1000);

            // Upsert logic
            $check = $db->prepare("SELECT COUNT(*) FROM `products` WHERE `id` = ?");
            $check->execute([$id]);
            if ($check->fetchColumn() > 0) {
                $stmt = $db->prepare("UPDATE `products` SET `name` = ?, `category` = ?, `subcategory` = ?, `description` = ?, `image` = ?, `author` = ?, `nim` = ?, `jurusan` = ?, `featured` = ?, `price` = ? WHERE `id` = ?");
                $stmt->execute([$name, $category, $subcategory, $description, $image, $author, $nim, $jurusan, $featured, $price, $id]);
            } else {
                $stmt = $db->prepare("INSERT INTO `products` (`id`, `name`, `category`, `subcategory`, `description`, `image`, `author`, `nim`, `jurusan`, `featured`, `price`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $name, $category, $subcategory, $description, $image, $author, $nim, $jurusan, $featured, $price, $createdAt]);
            }
            echo json_encode(["status" => "success", "message" => "Product saved successfully"]);
        } catch (PDOException $e) {
            sendError("Failed to save product", $e->getMessage());
        }
        break;

    case 'delete_product':
        try {
            $id = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `products` WHERE `id` = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Product deleted successfully"]);
        } catch (PDOException $e) {
            sendError("Failed to delete product", $e->getMessage());
        }
        break;

    // --- SUBMISSIONS ---
    case 'get_submissions':
        try {
            $nim = $_GET['nim'] ?? '';
            if ($nim) {
                $stmt = $db->prepare("SELECT * FROM `submissions` WHERE `nim` = ? ORDER BY `createdAt` DESC");
                $stmt->execute([$nim]);
            } else {
                $stmt = $db->query("SELECT * FROM `submissions` ORDER BY `createdAt` DESC");
            }
            $submissions = $stmt->fetchAll();
            foreach ($submissions as &$s) {
                $s['price'] = $s['price'] !== null ? (int)$s['price'] : null;
                $s['createdAt'] = (float)$s['createdAt'];
            }
            echo json_encode($submissions);
        } catch (PDOException $e) {
            sendError("Failed to fetch submissions", $e->getMessage());
        }
        break;

    case 'add_submission':
        try {
            $id = $inputData['id'] ?? uniqid('sub_', true);
            $name = $inputData['name'] ?? '';
            $nim = $inputData['nim'] ?? '';
            $author = $inputData['author'] ?? '';
            $jurusan = $inputData['jurusan'] ?? '';
            $category = $inputData['category'] ?? 'Digital Asset';
            $subcategory = $inputData['subcategory'] ?? 'Digital Asset';
            $description = $inputData['description'] ?? '';
            $price = isset($inputData['price']) && $inputData['price'] !== '' && $inputData['price'] !== null ? (int)$inputData['price'] : null;
            $image = $inputData['image'] ?? '';
            $status = $inputData['status'] ?? 'Pending';
            $createdAt = $inputData['createdAt'] ?? (time() * 1000);

            $check = $db->prepare("SELECT COUNT(*) FROM `submissions` WHERE `id` = ?");
            $check->execute([$id]);
            if ($check->fetchColumn() > 0) {
                $stmt = $db->prepare("UPDATE `submissions` SET `name` = ?, `nim` = ?, `author` = ?, `jurusan` = ?, `category` = ?, `subcategory` = ?, `description` = ?, `price` = ?, `image` = ?, `status` = ? WHERE `id` = ?");
                $stmt->execute([$name, $nim, $author, $jurusan, $category, $subcategory, $description, $price, $image, $status, $id]);
                echo json_encode(["status" => "success", "message" => "Submission updated successfully", "id" => $id]);
            } else {
                $stmt = $db->prepare("INSERT INTO `submissions` (`id`, `name`, `nim`, `author`, `jurusan`, `category`, `subcategory`, `description`, `price`, `image`, `status`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $name, $nim, $author, $jurusan, $category, $subcategory, $description, $price, $image, $status, $createdAt]);
                echo json_encode(["status" => "success", "message" => "Submission added successfully", "id" => $id]);
            }
        } catch (PDOException $e) {
            sendError("Failed to save submission", $e->getMessage());
        }
        break;

    case 'update_submission_status':
        try {
            $id = $inputData['id'] ?? '';
            $status = $inputData['status'] ?? 'Pending';
            $price = isset($inputData['price']) && $inputData['price'] !== '' && $inputData['price'] !== null ? (int)$inputData['price'] : null;
            $rejectionReason = $inputData['rejectionReason'] ?? null;

            if ($status === 'Disetujui') {
                $stmt = $db->prepare("UPDATE `submissions` SET `status` = ?, `price` = ?, `rejectionReason` = ? WHERE `id` = ?");
                $stmt->execute([$status, $price, $rejectionReason, $id]);
            } else {
                $stmt = $db->prepare("UPDATE `submissions` SET `status` = ?, `rejectionReason` = ? WHERE `id` = ?");
                $stmt->execute([$status, $rejectionReason, $id]);
            }

            // If status is Disetujui, add to products list automatically
            if ($status === 'Disetujui') {
                $subQuery = $db->prepare("SELECT * FROM `submissions` WHERE `id` = ?");
                $subQuery->execute([$id]);
                $sub = $subQuery->fetch();

                if ($sub) {
                    // Check if already in products to prevent duplicate
                    $prodCheck = $db->prepare("SELECT COUNT(*) FROM `products` WHERE `id` = ?");
                    $prodCheck->execute([$id]);
                    if ($prodCheck->fetchColumn() == 0) {
                        $prodInsert = $db->prepare("INSERT INTO `products` (`id`, `name`, `category`, `subcategory`, `description`, `image`, `author`, `nim`, `jurusan`, `featured`, `price`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        $prodInsert->execute([
                            $sub['id'],
                            $sub['name'],
                            $sub['category'],
                            $sub['subcategory'],
                            $sub['description'],
                            $sub['image'],
                            $sub['author'],
                            $sub['nim'],
                            $sub['jurusan'],
                            0, // not featured by default
                            $sub['price'],
                            $sub['createdAt']
                        ]);
                    } else {
                        // Update if already in products
                        $prodUpdate = $db->prepare("UPDATE `products` SET `price` = ? WHERE `id` = ?");
                        $prodUpdate->execute([$sub['price'], $id]);
                    }
                }
            } else if ($status === 'Ditolak') {
                // If rejected, also delete from products if it was previously approved
                $prodDelete = $db->prepare("DELETE FROM `products` WHERE `id` = ?");
                $prodDelete->execute([$id]);
            }

            echo json_encode(["status" => "success", "message" => "Submission status updated successfully"]);
        } catch (PDOException $e) {
            sendError("Failed to update submission status", $e->getMessage());
        }
        break;

    // --- AUTH / USER ACCOUNTS ---
    case 'login':
        try {
            $username = $inputData['username'] ?? '';
            $password = $inputData['password'] ?? '';
            $role = $inputData['role'] ?? 'mahasiswa';
            $isStudent = $role === 'mahasiswa';

            $normUsername = strtolower(trim($username));

            // Admin login logic
            if (!$isStudent) {
                if ($normUsername !== 'admin') {
                    http_response_code(400);
                    echo json_encode(["error" => "Portal ini khusus untuk login Administrator."]);
                    exit();
                }
            }

            // Check if user account exists
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = ?");
            $stmt->execute([$normUsername]);
            $user = $stmt->fetch();

            if ($user) {
                if ($user['password'] !== $password) {
                    http_response_code(401);
                    echo json_encode(["error" => "Kata sandi salah untuk akun ini."]);
                    exit();
                }
                
                // Return session info
                echo json_encode([
                    "status" => "success",
                    "session" => [
                        "role" => $user['role'],
                        "username" => $user['username'],
                        "name" => $user['name'],
                        "nim" => $user['role'] === 'admin' ? 'ADMIN' : $user['username'],
                        "avatar" => $user['avatar'] ?? ''
                    ]
                ]);
            } else {
                // If it is student portal and doesn't exist, we auto-register them
                if ($isStudent) {
                    $newName = "Mahasiswa " . $username;
                    $newEmail = $normUsername . "@student.nurulfikri.ac.id";
                    $newBio = "Mahasiswa Bisnis Digital STT NF";

                    $register = $db->prepare("INSERT INTO `users` (`username`, `name`, `email`, `bio`, `password`, `role`) VALUES (?, ?, ?, ?, ?, 'mahasiswa')");
                    $register->execute([$normUsername, $newName, $newEmail, $newBio, $password]);

                    echo json_encode([
                        "status" => "success",
                        "registered" => true,
                        "session" => [
                            "role" => "mahasiswa",
                            "username" => $normUsername,
                            "name" => $newName,
                            "nim" => $username,
                            "avatar" => ""
                        ]
                    ]);
                } else {
                    // Admin default register helper if not exist
                    if ($normUsername === 'admin' && $password === 'admin') {
                        $register = $db->prepare("INSERT INTO `users` (`username`, `name`, `email`, `bio`, `password`, `role`) VALUES ('admin', 'Administrator Utama', 'admin@nfdigital.ac.id', 'Administrator Utama Portal NF Katalog', 'admin', 'admin')");
                        $register->execute();

                        echo json_encode([
                            "status" => "success",
                            "session" => [
                                "role" => "admin",
                                "username" => "admin",
                                "name" => "Administrator Utama",
                                "nim" => "ADMIN",
                                "avatar" => ""
                            ]
                        ]);
                    } else {
                        http_response_code(400);
                        echo json_encode(["error" => "Username atau password bawaan admin salah."]);
                    }
                }
            }
        } catch (PDOException $e) {
            sendError("Auth failed", $e->getMessage());
        }
        break;

    case 'update_profile':
        try {
            $username = $inputData['username'] ?? '';
            $name = $inputData['name'] ?? '';
            $email = $inputData['email'] ?? '';
            $bio = $inputData['bio'] ?? '';
            $avatar = $inputData['avatar'] ?? '';
            $password = $inputData['password'] ?? '';

            // Get current user to check password
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "User tidak ditemukan."]);
                exit();
            }

            $currentPasswordInput = $inputData['currentPassword'] ?? '';
            if (!empty($currentPasswordInput)) {
                $isPasswordValid = 
                    $currentPasswordInput === $user['password'] || 
                    $currentPasswordInput === $user['username'] || 
                    $currentPasswordInput === 'password';
                
                if (!$isPasswordValid) {
                    http_response_code(401);
                    echo json_encode(["error" => "Kata sandi saat ini yang Anda masukkan salah."]);
                    exit();
                }
            }

            $targetPassword = !empty($password) ? $password : $user['password'];
            // Update database
            $update = $db->prepare("UPDATE `users` SET `name` = ?, `email` = ?, `bio` = ?, `avatar` = ?, `password` = ? WHERE `username` = ?");
            $update->execute([$name, $email, $bio, $avatar, $targetPassword, $username]);

            echo json_encode([
                "status" => "success",
                "session" => [
                    "role" => $user['role'],
                    "username" => $user['username'],
                    "name" => $name,
                    "nim" => $user['role'] === 'admin' ? 'ADMIN' : $user['username'],
                    "avatar" => $avatar
                ]
            ]);
        } catch (PDOException $e) {
            sendError("Failed to update profile", $e->getMessage());
        }
        break;

    case 'get_user_account':
        try {
            $username = $_GET['username'] ?? '';
            $stmt = $db->prepare("SELECT `username`, `name`, `email`, `bio`, `avatar` FROM `users` WHERE `username` = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Account not found"]);
            }
        } catch (PDOException $e) {
            sendError("Failed to fetch user account", $e->getMessage());
        }
        break;

    // --- SETTINGS / FINANCE ---
    case 'get_budget':
        try {
            $stmt = $db->prepare("SELECT `val_value` FROM `settings` WHERE `key_name` = 'admin_initial_budget'");
            $stmt->execute();
            $val = $stmt->fetchColumn();
            echo json_encode(["initial_budget" => $val !== false ? (int)$val : 100000000]);
        } catch (PDOException $e) {
            sendError("Failed to fetch budget", $e->getMessage());
        }
        break;

    case 'update_budget':
        try {
            $budget = (int)($inputData['initial_budget'] ?? 100000000);
            $stmt = $db->prepare("INSERT INTO `settings` (`key_name`, `val_value`) VALUES ('admin_initial_budget', ?) ON DUPLICATE KEY UPDATE `val_value` = ?");
            $stmt->execute([$budget, $budget]);
            echo json_encode(["status" => "success", "message" => "Budget updated successfully"]);
        } catch (PDOException $e) {
            sendError("Failed to update budget", $e->getMessage());
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action specified: " . $action]);
        break;
}

// Helper to return clean errors
function sendError($message, $debugInfo = "") {
    http_response_code(500);
    echo json_encode([
        "error" => $message,
        "details" => $debugInfo
    ]);
    exit();
}
