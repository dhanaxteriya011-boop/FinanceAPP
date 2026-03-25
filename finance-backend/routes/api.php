<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LoanApplicationController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Authenticated user routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Loan routes
    Route::post('/loans/check-eligibility',          [LoanApplicationController::class, 'checkEligibility']);
    Route::post('/loans',                             [LoanApplicationController::class, 'store']);
    Route::get('/loans',                              [LoanApplicationController::class, 'index']);
    Route::get('/loans/{id}',                         [LoanApplicationController::class, 'show']);
    Route::post('/loans/{applicationId}/documents',   [LoanApplicationController::class, 'uploadDocument']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard',                             [AdminController::class, 'dashboard']);
    Route::get('/applications',                          [AdminController::class, 'applications']);
    Route::get('/applications/{id}',                     [AdminController::class, 'showApplication']);
    Route::patch('/applications/{id}/status',            [AdminController::class, 'updateStatus']);
    Route::patch('/documents/{documentId}/verify',       [AdminController::class, 'verifyDocument']);
    Route::get('/users',                                 [AdminController::class, 'users']);
    Route::get('/documents/{id}/view',                   [AdminController::class, 'viewDocument']);
});