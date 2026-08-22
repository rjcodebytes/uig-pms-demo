<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PosModel;

class PosController extends Controller
{
    public function list()
    {
        $data['getRecords'] = PosModel::getRecords();
        return view("admin.position.list", $data);
    }
    public function createpos()
    {
        return view("admin.position.add");
    }

    public function insert(Request $request)
    {
        $save = new PosModel;
        $save->name = $request->posname;
        $save->save();

        return redirect('admin/positions')->with('success','New Position Successfully Created!');
    }

    public function edit($name)
    {
        $data['getRecord'] = PosModel::find($name);
        return view("admin.position.edit", $data);
    }

    public function updatepos($name, Request $request)
    {
        $save = PosModel::where('name', $name);
        $save->name = $request->posname;
        $save->save();

        return redirect('admin/positions')->with('success','Position Successfully Updated!');
    }

    public function deletepos($name, Request $request)
    {
        try {
            $save = PosModel::where('name', $name);
            $save->delete();

            return redirect()->back()->with('success','Position Successfully Deleted!');
        } catch (\Exception $e) {

            // Redirect back with an error message
            return redirect()->back()->with('error', 'Position cannot be deleted!');
        }
    }

}
