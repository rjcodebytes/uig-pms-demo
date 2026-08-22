<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ProcModel;
use App\Models\User;
use App\Models\DeptModel;
use App\Models\PurchaseType;
use App\Models\PurchaseCommittee;
use App\Models\PurchaseModel;
use App\Models\WorkflowModel;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Mail;
use App\Mail\ProcUpdateMail;

class PurchaseController extends Controller
{
    public function showRequest(Request $request)
    {   // Fetch all departments for the dropdown
        $departments = DeptModel::all();

        // Get department filter from request
        $filters = [];
        if ($request->has('department') && $request->department != 'Department') {
            $filters['department'] = $request->department;
        }
        // Fetch documents
        $workflows = WorkflowModel::getWorkflow($filters);

        $allowedPositions = ['Store Keeper', 'Store Incharge'];
        $userPosition = Auth::user()->position; // Assuming 'position' is stored in the user's table
        $showFilter = in_array($userPosition, $allowedPositions);

        //dd($workflows->toArray());
        return view('storeincharge.purchase.purchaselist', compact('workflows', 'showFilter', 'departments'));
    }

    public function reviewRequest(Request $request, $id)
    {
        $document = ProcModel::getSingle($id);
        $purchase_type = PurchaseType::getSingle($document->purchase_type);
        $initiator = User::getSingle($document->initiator_id);
        $department = DeptModel::getSingle($initiator->department);

        return view('storeincharge.purchase.review', compact('document', 'purchase_type', 'initiator', 'department'));
    }

    public function forwardRequest(Request $request, $id)
    {
        // Validate file and input fields
        $request->validate([
            'remark' => 'nullable|string',
        ]);

        // Retrieve the current workflow entry for the document and reviewer
        $workflow = WorkflowModel::where('document_id', $id)
            ->where('reviewer_id', Auth::id())
            ->where('status', 'Pending')
            ->first();

        if (!$workflow) {
            return redirect('storeincharge/purchase')->with('error', 'Request already forwarded to Store Keeper.');
        }

        // Update the current workflow status
        $workflow->status = "Approved";
        $workflow->remark = $request->remark;
        $workflow->updated_at = now();
        $workflow->save();

        $document = ProcModel::find($id);
        $initiator = User::find($document->initiator_id);

        // Determine the next reviewer based on the current reviewer position
        $nextReviewerPosition = "Store Keeper";

        if ($nextReviewerPosition) {
            $nextReviewer = User::where('position', $nextReviewerPosition)
                ->first();
            if (!$nextReviewer) {
                return redirect('storeincharge/purchase')->with('error', 'No reviewer found for the next position: ' . $nextReviewerPosition);
            }
            // Save the response into the database
            $response = new WorkflowModel();
            $response->document_id = $id;
            $response->reviewer_id = $nextReviewer->id;
            $response->status = 'Pending';
            $response->save();

            if ($initiator) {
                $initiatorEmailData = [
                    'recipient_name' => $initiator->name,
                    'message' => 'Your procurement document has been approved by ' . $workflow->reviewer->position . ' and forwarded to ' . $nextReviewer->position . '.',
                    'doc_title' => $document->doc_title,
                    'doc_desc' => $document->doc_desc,
                    'status' => 'Forwarded to ' . $nextReviewer->position,
                    'remark' => $request->remark,
                ];

                Mail::to($initiator->email)->send(new ProcUpdateMail($initiatorEmailData));
            }

            return redirect('storeincharge/purchase')->with('success', 'Request forwarded to ' . $nextReviewer->position . '.');
        }

        return redirect()->back()->with('success', 'Request already forwarded to Store Keeper.');

    }

    public function listPurchaseRequest(Request $request)
    {   // Fetch all departments for the dropdown
        $departments = DeptModel::all();

        // Get department filter from request
        $filters = [];
        if ($request->has('department') && $request->department != 'Department') {
            $filters['department'] = $request->department;
        }
        // Fetch documents
        $workflows = WorkflowModel::getWorkflow($filters);

        $allowedPositions = ['Store Keeper', 'Store Incharge'];
        $userPosition = Auth::user()->position; // Assuming 'position' is stored in the user's table
        $showFilter = in_array($userPosition, $allowedPositions);
        //dd($workflows->toArray());
        return view('storekeeper.purchase.listrequest', compact('workflows', 'showFilter', 'departments'));
    }

    public function viewRequest($id)
    {
        $document = ProcModel::getSingle($id);
        $purchase_type = PurchaseType::getSingle($document->purchase_type);
        $initiator = User::getSingle($document->initiator_id);
        $department = DeptModel::getSingle($initiator->department);
        return view('storekeeper.purchase.viewrequest', compact('document', 'purchase_type', 'initiator', 'department'));
    }

    public function startpurchase($id)
    {
        $document = ProcModel::getSingle($id);
        $users = User::getUsers();

        return view('storekeeper.purchase.startpurchase', compact('document', 'users'));
    }

    public function store(Request $request, $id)
    {
        // Validate input
        $request->validate([
            'purchase_id' => 'required|unique:purchases,purchase_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'document' => 'nullable|mimes:pdf|max:2048',
            'committee_members' => 'required|array',
        ]);

        //dd($request);

        // Save purchase data
        $purchase = PurchaseModel::create([
            'purchase_id' => $request->purchase_id,
            'document_id' => $id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        // Handle document uploads
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            //$fileName = $file->getClientOriginalName();
            $fileData = file_get_contents($file->getRealPath());
            $purchase->document = $fileData;
            $purchase->save();
        }

        //dd($purchase);

        // Save committee members
        foreach ($request->committee_members as $userId) {
            PurchaseCommittee::create([
                'purchase_id' => $purchase->purchase_id,
                'user_id' => $userId,
            ]);
        }

        $workflow = WorkflowModel::where('document_id', $id)
            ->where('reviewer_id', Auth::id())
            ->where('status', 'Pending')
            ->first();

        if (!$workflow) {
            return redirect('approver/procurement')->with('error', 'No pending workflow entry found for this document.');
        }

        // Update the current workflow status
        $workflow->status = "Approved";
        $workflow->remark = "Purchase process has been started.";
        $workflow->updated_at = now();
        $workflow->save();

        //dd($purchase);

        return redirect('storekeeper/purchase')->with('success', 'Purchase and committee members saved successfully.');
    }

    public function createdpurchaserequest()
    {
        // Fetch purchases
        $purchases = PurchaseModel::with('documentID.purchaseType')
                    ->orderBy('created_at', 'desc')
                    ->get();

        // dd($purchases[0]);
        return view('storekeeper.purchase.createdpurchaserequest', compact('purchases'));
    }

    public function viewpurchaserequest(Request $request, $id)
    {
        // Fetch the purchase details based on the ID passed in the query string
        $purchase = PurchaseModel::where('purchase_id', $id)->first();
        $document = ProcModel::getSingle($purchase->document_id);
        $purchase_type = PurchaseType::getSingle($document->purchase_type);

        //dd($purchase);
        // Fetch the purchase committee members for the purchase
        $committee = PurchaseCommittee::where('purchase_id', $purchase->purchase_id)
            ->join('users', 'users.id', '=', 'purchase_committee.user_id') // Assuming 'users' table holds user details
            ->select('users.name', 'users.email') // Fetching committee member details
            ->get();
        // If no purchase is found, redirect back with an error message
        if (!$purchase) {
            return redirect()->back()->with('error', 'Purchase request not found.');
        }

        return view('storekeeper.purchase.viewpurchaserequest', compact('purchase', 'document', 'purchase_type', 'committee'));
    }

    public function storeVendorDetails(Request $request, $id)
    {
        //dd($request);
        // Validate input
        $request->validate([
            'purchaseOrder' => 'nullable|string|max:255',
            'vendorName' => 'nullable|string',
            'paymentDetails' => 'nullable|string',
            'contractDocument' => 'nullable|mimes:pdf|max:2048',
            'remark' => 'nullable|string',
            'status' => 'required|in:Complete,Not Complete,Pending',
        ]);

        // Fetch the purchase details based on the ID passed in the query string
        $vendor = PurchaseModel::where('purchase_id', $id)->first();

        // If no purchase is found, redirect back with an error message
        if (!$vendor) {
            return redirect()->back()->with('error', 'Purchase request not found.');
        }

        $vendor->purchase_order = $request->purchaseOrder;
        $vendor->vendor_name = $request->vendorName;
        $vendor->payment_details = $request->paymentDetails;
        $vendor->remark = $request->remark;
        $vendor->status = $request->status;
        $vendor->save();

        if ($request->hasFile('contractDocument')) {
            $file = $request->file('contractDocument');
            $fileData = file_get_contents($file->getRealPath());
            $vendor->contract_doc = $fileData;
            $vendor->save();
        }

        return redirect()->back()->with('success', 'Vendor details entered successfully!');
    }

    public function viewPurchaseDocument($id)
    {
        $purchase = PurchaseModel::findOrFail($id);

        // Return the PDF as a response
        return response($purchase->document)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="document.pdf"');
    }

    public function viewContractDocument($id)
    {
        $purchase = PurchaseModel::findOrFail($id);

        // Return the PDF as a response
        return response($purchase->contract_doc)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="document.pdf"');
    }
}
