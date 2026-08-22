<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseType;
use Illuminate\Support\Facades\Auth;

class PurchaseTypeController extends Controller
{
    public function list()
    {
        $user = Auth::user(); // Get the logged-in user

        if ($user->position === 'Admin') {
            $data['getRecords'] = PurchaseType::getRecords();
            return view('admin.purchasetype.purchase', $data);
        } elseif ($user->position === 'Principal') {
            $data['getRecords'] = PurchaseType::getRecords();
            return view('approver.purchasetype.purchase', $data);
        }

        return redirect('/')->with('error', 'Unauthorized access.');
    }

    public function createtype()
    {
        $user =  Auth::user();

        if ($user->position === 'Admin') {
            return view('admin.purchasetype.add');
        } elseif ($user->position === 'Principal') {
            return view('approver.purchasetype.add');
        }

        return redirect('/')->with('error', 'Unauthorized access.');
    }

    public function insert(Request $request)
    {
        $user =  Auth::user();

        if (in_array($user->position, ['Admin']) || $user->position === 'Principal') {
            $request->validate([
                'purchase_type' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'estimated_cost' => 'required|string|max:50',
            ]);

            $save = new PurchaseType();
            $save->name = $request->purchase_type;
            $save->description = $request->description;
            $save->estimated_cost = $request->estimated_cost;
            $save->save();

            $redirectPath = $user->position === 'Admin' ? 'admin/purchase' : 'approver/purchase';
            return redirect($redirectPath)->with('success', 'Purchase type added successfully.');
        }

        return redirect('/')->with('error', 'Unauthorized access.');
    }

    public function edit($name)
    {
        $user =  Auth::user();
        $redirectPath = $user->position === 'Admin' ? 'admin/purchase' : 'approver/purchase';

        $data['getRecord'] = PurchaseType::where('name', $name)->first();
        if (!$data['getRecord']) {
            return redirect($redirectPath)->with('error', 'Purchase Type not found.');
        }

        $viewPath = $user->position === 'Admin' ? 'admin.purchasetype.edit' : 'approver.purchasetype.edit';
        return view($viewPath, $data);
    }

    public function updateptype($name, Request $request)
    {
        $user =  Auth::user();

        if (in_array($user->position, ['Admin']) || $user->position === 'Principal') {
            $request->validate([
                'ptypename' => 'required|string|max:255|unique:purchase_types,name,' . $name . ',name',
            ]);

            $purchaseType = PurchaseType::where('name', $name)->first();
            if ($purchaseType) {
                $purchaseType->name = $request->ptypename;
                $purchaseType->save();
            }

            $redirectPath = $user->position === 'Admin' ? 'admin/purchase' : 'approver/purchase';
            return redirect($redirectPath)->with('success', 'Purchase Type Updated Successfully');
        }

        return redirect('/')->with('error', 'Unauthorized access.');
    }

    public function deleteptype($name)
    {
        $user =  Auth::user();

        if (in_array($user->position, ['Admin']) || $user->position === 'Principal') {
            try {
                PurchaseType::where('name', $name)->delete();

                $redirectPath = $user->position === 'Admin' ? 'admin/purchase' : 'approver/purchase';
                return redirect($redirectPath)->with('success', 'Purchase Type Successfully Deleted!');
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Position cannot be deleted!');
            }
        }

        return redirect('/')->with('error', 'Unauthorized access.');
    }
}
