<?php

namespace App\Http\Controllers;

use App\Models\DeptModel;
use App\Models\RoleModel;
use App\Models\PosModel;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

//For sending Email
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function userlist()
    {
        $users = User::getRecords();
        return view('admin.users.userlist',compact('users'));

    }

    public function createuser()
    {
        $data['getRoles'] = RoleModel::getRecords();
        $data['getDept'] = DeptModel::getRecords();
        $data['getPos'] = PosModel::getRecords();
        return view('admin.users.createuser',$data);
    }

    public function insert(Request $request)
    {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'mobile' => 'required|integer',
            'gender' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'required|min:5',
            'role' => 'required|integer',
            'position' => 'nullable|string',
            'department' => 'nullable|string'

        ]);

        $to=$request->email;
        $subject= "Your Account Credentials for PMS - GCoEJ";
        $userData = [
            'name' => $request->name,
            'username' => $request->username,
            'password' => $request->password,
        ];

        $record = new User;
        $record->fill([
            'name' => trim($request->name),
            'email' => trim($request->email),
            'mobile' => $request->mobile,
            'gender' => trim($request->gender),
            'username' => trim($request->username),
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'position' => $request->position ?? null,
            'department' => $request->department ?? null,
        ]);
        $record->save();

        try {
            Mail::to($to)->send(new WelcomeEmail($subject, $userData));
        } catch (\Exception $e) {
            return redirect('admin/users')->with('error', 'User created, but email could not be sent.');
        }

        return redirect('admin/users')->with('success', "User Successfully Created!");
    }
    public function edituser($id)
    {
        $data['getRecord'] = User::getSingle($id);
        $data['getRole'] = RoleModel::getRecords();
        $data['getDept'] = DeptModel::getRecords();
        $data['getPos'] = PosModel::getRecords();
        return view('admin.users.edit',$data);
    }

    public function update($id, Request $request)
    {
    // Fetch the role name for validation
    $roleName = RoleModel::find($request->role)->name;
    $positionName = PosModel::find($request->position)->name;


    // Validate the request
    $request->validate([
        'name' => 'required|string|max:255',
        'mobile' => 'required|numeric',
        'gender' => 'required',
        'role' => 'required|exists:roles,id',
        'department' => ($roleName === 'Initiator' || ($roleName === 'Approver' && $positionName ==='Head Of Department')) ? 'required|exists:departments,name' : 'nullable',
        'position' => in_array($roleName, ['Initiator', 'Approver']) ? 'required|exists:positions,name' : 'nullable',
    ]);

    // Update the fields
    $record = User::getSingle($id);
    $record->name = trim($request->name);
    $record->mobile = trim($request->mobile);
    $record->gender = $request->gender;
    if (!empty($request->password)) {
        $record->password = Hash::make($request->password);
    }
    $record->role = $request->role;
    $record->department = ($roleName === 'Initiator' || ($roleName === 'Approver' && $positionName ==='Head Of Department')) ? $request->department : null;
    $record->position = in_array($roleName, ['Initiator', 'Approver']) ? $request->position : null;
    $record->save();

    return redirect('admin/users')->with('success', "User Successfully Updated!");
    }


    public function delete($id)
    {
        $user = User::getSingle($id);
        $user->delete();

        return redirect('admin/users')->with('success','User Successfully Deleted!');
    }

    public function updateprofile(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . Auth::id(),
        ]);

        // If validation fails, redirect back with errors
        if ($validator->fails()) {
            return redirect()->back()
                ->with('error', 'Email already exist. Please try again with different Email.');
        }

        // Update the authenticated user's information
        try {
        // Update the authenticated user's information
        $user = Auth::user();
        $user->name = $request->input('fullName');
        $user->email = $request->input('email');
        /** @var \App\Models\User $user **/
        $user->save();

        // Redirect with a success message
        return redirect()->back()->with('success', 'Profile updated successfully!');
    } catch (\Exception $e) {
        // Redirect with error message if something goes wrong
        return redirect()->back()->with('error', 'An error occurred while updating the profile. Please try again later.');
    }
    }

    public function changePassword(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'password' => 'required', // Current password
            'newpassword' => 'required|min:5|confirmed', // New password, confirmed ensures matches renewpassword
        ]);

        // If validation fails, redirect back with errors
        if ($validator->fails()) {
            return redirect()->back()
                ->with('error', 'New Password did not matched. Please try again.');
        }

        // Get the currently authenticated user
        $user = Auth::user();

        // Check if the current password is correct
        if (!Hash::check($request->password, $user->password)) {
            return redirect()->back()->with('error', 'The current password is incorrect.');
        }
        else{
            // Update the password
            try {
                $user->password = Hash::make($request->newpassword);
                /** @var \App\Models\User $user **/
                $user->save();

                return redirect()->back()->with('success', 'Password changed successfully.');
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'An error occurred while changing the password. Please try again.');
            }
        }
    }


}
