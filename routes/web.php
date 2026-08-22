<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DeptController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseTypeController;

    Route::get('/', [AuthController::class , 'login'])->name('login');;
    Route::post('/', [AuthController::class , 'auth_login']);

    Route::get('logout', [AuthController::class , 'logout'])->name('logout');

    Route::post('/change-password', [UserController::class, 'changePassword'])->name('change-password');
    Route::get('/contact', function () { return view('contact'); });
    Route::get('/view-document/{id}', [DocumentController::class, 'viewDocument'])->name('document.view');
    Route::get('/purchase-document/{id}', [PurchaseController::class, 'viewPurchaseDocument'])->name('purchase.view');
    Route::get('/contract-document/{id}', [PurchaseController::class, 'viewContractDocument'])->name('contract.view');
    Route::get('/document/status/{id}', [DocumentController::class, 'getStatus'])->name('document.status');

Route::middleware(['auth', 'useradmin:1'])->group(function () {

    Route::post('/profile', [UserController::class, 'updateprofile'])->name('profile.update');
    Route::get('admin/dashboard', [DashboardController::class , 'dashboard']);

    Route::get('admin/profile', [DashboardController::class , 'profile']);

    Route::get('admin/users', [UserController::class , 'userlist']);
    Route::get('admin/users/createuser', [UserController::class , 'createuser']);
    Route::post('admin/users/createuser', [UserController::class , 'insert']);
    Route::get('admin/users/edituser/{id}', [UserController::class , 'edituser']);
    Route::post('admin/users/edituser/{id}', [UserController::class , 'update']);
    Route::get('admin/users/deleteuser/{id}', [UserController::class , 'delete']);


    Route::get('admin/roles', [RoleController::class , 'list']);
    Route::get('admin/roles/add', [RoleController::class , 'createrole']);
    Route::post('admin/roles/add', [RoleController::class , 'insert']);
    Route::get('admin/roles/edit/{id}', [RoleController::class , 'edit']);
    Route::post('admin/roles/edit/{id}', [RoleController::class , 'updaterole']);
    Route::get('admin/roles/delete/{id}', [RoleController::class , 'deleterole']);

    Route::get('admin/departments', [DeptController::class , 'list']);
    Route::get('admin/departments/add', [DeptController::class , 'createdept']);
    Route::post('admin/departments/add', [DeptController::class , 'insert']);
    Route::get('admin/departments/edit/{name}', [DeptController::class , 'edit']);
    Route::post('admin/departments/edit/{name}', [DeptController::class , 'updatedept']);
    Route::get('admin/departments/delete/{name}', [DeptController::class , 'deletedept']);

    Route::get('admin/positions', [PosController::class , 'list']);
    Route::get('admin/positions/add', [PosController::class , 'createpos']);
    Route::post('admin/positions/add', [PosController::class , 'insert']);
    Route::get('admin/positions/edit/{name}', [PosController::class , 'edit']);
    Route::post('admin/positions/edit/{name}', [PosController::class , 'updatepos']);
    Route::get('admin/positions/delete/{name}', [PosController::class , 'deletepos']);

    Route::get('admin/purchase', [PurchaseTypeController::class , 'list']);
    Route::get('admin/purchase/add', [PurchaseTypeController::class , 'createtype']);
    Route::post('admin/purchase/add', [PurchaseTypeController::class , 'insert']);
    Route::get('admin/purchase/edit/{name}', [PurchaseTypeController::class , 'edit']);
    Route::post('admin/purchase/edit/{name}', [PurchaseTypeController::class , 'updateptype']);
    Route::get('admin/purchase/delete/{name}', [PurchaseTypeController::class , 'deleteptype']);
});

Route::middleware(['auth', 'useradmin:2'])->group(function () {

    Route::get('approver/dashboard', function () {
        return view('approver.dashboard');
    });

    Route::get('approver/profile', [DashboardController::class , 'approverProfile']);

    Route::get('approver/procurement', [DocumentController::class , 'showRequest'])->name('approver.procurement');

    Route::get('approver/procurement/view/{id}', [DocumentController::class, 'showDetails'])->name('procurement.view');

    Route::get('approver/procurement/response/{id}', [DocumentController::class, 'generateResponse'])->name('procurement.generate');

    Route::post('/submit-response/{id}', [DocumentController::class, 'submitResponse'])->name('procurement.response');

    //Routes for principal to add/update/delete purchase process type
    Route::get('approver/purchase', [PurchaseTypeController::class , 'list']);
    Route::get('approver/purchase/add', [PurchaseTypeController::class , 'createtype']);
    Route::post('approver/purchase/add', [PurchaseTypeController::class , 'insert']);
    Route::get('approver/purchase/edit/{name}', [PurchaseTypeController::class , 'edit']);
    Route::post('approver/purchase/edit/{name}', [PurchaseTypeController::class , 'updateptype']);
    Route::get('approver/purchase/delete/{name}', [PurchaseTypeController::class , 'deleteptype']);
});

Route::middleware(['auth', 'useradmin:3'])->group(function ()
{
    Route::get('initiator/dashboard', function () {
        return view('initiator.dashboard');
    });
    Route::get('initiator/profile', [DashboardController::class , 'initiatorProfile']);

    Route::get('initiator/procurement', [DocumentController::class, 'procurementPage'])->name('procurement.page');

    Route::get('initiator/procurement/track/{id}', [DocumentController::class, 'procurementTrack'])->name('procurement.track');

    Route::post('/upload-document', [DocumentController::class, 'uploadDocument'])->name('document.upload');

    Route::get('initiator/procurement/create', [DocumentController::class, 'createDocument'])->name('document.create');

    Route::get('initiator/procurement/edit/{id}', [DocumentController::class, 'editDocument'])->name('document.edit');

    Route::get('initiator/procurement/delete/{id}', [DocumentController::class, 'deleteDocument'])->name('document.delete');

    Route::post('/submit-document/{id}', [DocumentController::class, 'uploadEditedDocument'])->name('document.edit.upload');
});

Route::middleware(['auth', 'useradmin:4'])->group(function () {

    Route::get('storeincharge/dashboard', function () {
        return view('storeincharge.dashboard');
    });
    Route::get('storeincharge/profile', [DashboardController::class , 'storeinchargeProfile']);

    Route::get('storeincharge/purchase', [PurchaseController::class , 'showRequest']);

    Route::get('storeincharge/purchase/review/{id}', [PurchaseController::class , 'reviewRequest']);

    Route::post('/forward-request/{id}', [PurchaseController::class, 'forwardRequest'])->name('document.edit.upload');

});


Route::middleware(['auth', 'useradmin:5'])->group(function () {

    Route::get('storekeeper/dashboard', function () {
        return view('storekeeper.dashboard');
    });
    Route::get('storekeeper/profile', [DashboardController::class , 'storekeeperProfile']);

    Route::get('storekeeper/purchase', [PurchaseController::class , 'listPurchaseRequest']);

    Route::get('storekeeper/purchase/view', [PurchaseController::class , 'createdpurchaserequest']);

    Route::get('storekeeper/purchase/view/{id}', [PurchaseController::class , 'viewRequest']);

    Route::get('storekeeper/purchase/startpurchase/{id}', [PurchaseController::class , 'startPurchase']);

    Route::get('storekeeper/purchase/viewpurchaserequest/{id}', [PurchaseController::class , 'viewpurchaserequest']);

    Route::post('/vendor-details-store/{id}', [PurchaseController::class , 'storeVendorDetails']);

    Route::post('/purchase-store/{id}', [PurchaseController::class, 'store']);
});

Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});
