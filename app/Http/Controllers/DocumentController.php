<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ProcModel;
use App\Models\PosModel;
use App\Models\PurchaseType;

use App\Models\User;
use App\Models\DeptModel;
use App\Models\WorkflowModel;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use Illuminate\Support\Facades\Mail;
use App\Mail\ProcurementMail;
use App\Mail\ProcUpdateMail;

class DocumentController extends Controller
{
    public function uploadDocument(Request $request)
    {
        // Validate file and input fields
        $request->validate([
            'doc_title' => 'required|string|max:255',
            'doc_desc' => 'required|string',
            'purchase_type' => 'required',
            'document' => 'required|mimes:pdf|max:300', // Maximum size of 300KB
        ]);

        if ($request->hasFile('document')) {
            // Retrieve file from request
            $file = $request->file('document');

            // Open file and convert it to binary data
            $fileData = file_get_contents($file->getRealPath());
        }

        $initiator = Auth::user();
        $hod = User::where('role', 2)
            ->where('department', $initiator->department)
            ->first();

        //dd($hod);

        if (!$hod) {
            return redirect('initiator/procurement')->with('error', 'No HOD found for the respective department.');
        }

        // Save the document into the database
        $document = new ProcModel();
        $document->doc_title = $request->input('doc_title');
        $document->doc_desc = $request->input('doc_desc');
        $document->purchase_type = $request->input('purchase_type');
        $document->initiator_id = Auth::id();
        $document->documents = $fileData;
        $document->status = "Pending";
        $document->save();

        //dd($document);

        // Create a workflow entry
        WorkflowModel::create([
            'document_id' => $document->doc_id,
            'reviewer_id' => $hod->id,
            'status' => 'Pending',
            'remark' => 'Send to HOD',
        ]);

        // Email data for initiator
        $initiatorEmailData = [
            'recipient_name' => $initiator->name,
            'message' => 'Your procurement document has been successfully uploaded.',
            'doc_title' => $document->doc_title,
            'doc_desc' => $document->doc_desc,
            'status' => 'Document Uploaded successfully',
        ];

        // Email data for HOD
        $hodEmailData = [
            'recipient_name' => $hod->name,
            'message' => 'A new procurement document has been submitted for review by ' . $initiator->name . '.',
            'doc_title' => $document->doc_title,
            'doc_desc' => $document->doc_desc,
            'status' => 'Pending Review',
        ];

        // Send email to initiator
        Mail::to($initiator->email)->send(new ProcurementMail($initiatorEmailData, 'initiator'));

        // Send email to HOD
        Mail::to($hod->email)->send(new ProcurementMail($hodEmailData, 'hod'));
        return redirect('initiator/procurement')->with('success', 'Procurement document created and forwarded to HOD.');
    }

    public function procurementPage()
    {
        $documents = ProcModel::where('initiator_id', Auth::id())
            ->whereHas('latestWorkflow')
            ->with([
                'latestWorkflow' => function ($query) {
                    $query->select('id', 'document_id', 'reviewer_id', 'status')
                        ->with([
                            'reviewer' => function ($query) {
                                $query->select('id', 'name', 'position'); // Fetch reviewer details
                            }
                        ]);
                }
            ])
            ->get();
        return view('initiator.procurement.documentlist', compact('documents'));
    }

    public function createDocument()
    {
        $purchase_types = PurchaseType::all();
        return view('initiator.procurement.createdocument', compact('purchase_types'));
    }

    public function editDocument($id)
    {
        $document = ProcModel::getSingle($id);
        $purchase_types = PurchaseType::all();
        return view('initiator.procurement.editdocument', compact('document', 'purchase_types'));
    }

    public function uploadEditedDocument(Request $request, $id)
    {
        // // Validate input fields and document if uploaded
        $request->validate([
            'doc_title' => 'required|string|max:255',
            'doc_desc' => 'required|string',
            'purchase_type' => 'required',
            'document' => 'nullable|mimes:pdf|max:300', // Document is optional
        ]);

        // Find the existing document by ID
        $document = ProcModel::find($id);

        if (!$document) {
            return redirect()->back()->with('error', 'Document not found.');
        }

        //dd($document);

        // Check if a new document file is uploaded
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $fileData = file_get_contents($file->getRealPath());
            $document->documents = $fileData; // Update the document content
        }

        // Update the document fields
        $document->doc_title = $request->input('doc_title');
        $document->doc_desc = $request->input('doc_desc');
        $document->purchase_type = $request->input('purchase_type');
        $document->initiator_id = Auth::id();
        $document->status = "Pending";
        $document->save();

        $initiator = Auth::user();
        $hod = User::where('role', 2)
            ->where('department', $initiator->department)
            ->first();

        //dd($hod);

        if (!$hod) {
            return redirect('initiator/procurement')->with('error', 'No HOD found for the respective department.');
        }

        // Delete all existing workflow entries for this document
        WorkflowModel::where('document_id', $document->doc_id)->delete();

        // Create a workflow entry
        WorkflowModel::create([
            'document_id' => $document->doc_id,
            'reviewer_id' => $hod->id,
            'status' => 'Pending',
            'remark' => 'Send to HOD',
        ]);

        return redirect('initiator/procurement')->with('success', 'Procurement document created and forwarded to HOD.');
    }

    public function deleteDocument($id)
    {
        $document = ProcModel::getSingle($id);
        $document->delete();

        return redirect('initiator/procurement')->with('success', 'Procurement document deleted successfully!');
    }

    public function procurementTrack($id)
    {
        $document = ProcModel::getSingle($id);
        $purchase_type = PurchaseType::getSingle($document->purchase_type);
        $initiator = User::getSingle($document->initiator_id);

        $workflowData = WorkflowModel::with('reviewer')
            ->where('document_id', $id)
            ->get()
            ->map(function ($workflow) {
                return [
                    'position' => $workflow->reviewer->position ?? 'N/A',
                    'status' => $workflow->status,
                    'remark' => $workflow->remark,
                    'date' => Carbon::parse($workflow->updated_at)->format('d/m/Y'), // Format the date here
                ];
            });

        //dd($workflowData);

        return view('initiator.procurement.trackdocument', compact('document', 'initiator', 'purchase_type', 'workflowData'));
    }

    public function viewDocument($id)
    {
        $document = ProcModel::findOrFail($id);

        // Return the PDF as a response
        return response($document->documents)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="document.pdf"');
    }

    public function showRequest(Request $request)
    {
        // Fetch all departments for the dropdown
        $departments = DeptModel::all();

        // Get department filter from request
        $filters = [];
        if ($request->has('department') && $request->department != 'Department') {
            $filters['department'] = $request->department;
        }

        // Fetch workflows with filters
        $workflows = WorkflowModel::getWorkflow($filters);

        // Check user positions
        $allowedPositions = ['Office Superintendent', 'Registrar', 'Principal'];
        $userPosition = Auth::user()->position; // Assuming 'position' is stored in the user's table
        $showFilter = in_array($userPosition, $allowedPositions);

        return view('approver.procurement.list', compact('workflows', 'showFilter', 'departments'));
    }


    public function showDetails($id)
    {
        $document = ProcModel::getSingle($id);
        $purchase_type = PurchaseType::getSingle($document->purchase_type);
        $initiator = User::getSingle($document->initiator_id);
        $department = DeptModel::getSingle($initiator->department);
        $workflowData = WorkflowModel::with('reviewer')
            ->where('document_id', $id)
            ->get()
            ->map(function ($workflow) {
                return [
                    'position' => $workflow->reviewer->position ?? 'N/A',
                    'status' => $workflow->status,
                    'remark' => $workflow->remark,
                    'date' => Carbon::parse($workflow->updated_at)->format('d/m/Y'), // Format the date here
                ];
            });
        return view('approver.procurement.view', compact('document', 'initiator', 'purchase_type', 'department', 'workflowData'));
    }

    public function generateResponse(Request $request, $id)
    {
        $document = ProcModel::getSingle($id);
        $initiator = User::getSingle($document->initiator_id);
        $department = DeptModel::getSingle($initiator->department);

        return view('approver.procurement.response', compact('document', 'initiator', 'department'));
    }

    public function submitResponse(Request $request, $id)
    {
        // Validate file and input fields
        $request->validate([
            'action' => 'required|string|max:255',
            'remark' => 'required|string',
        ]);

        // Retrieve the current workflow entry for the document and reviewer
        $workflow = WorkflowModel::where('document_id', $id)
            ->where('reviewer_id', Auth::id())
            ->where('status', 'Pending')
            ->first();

        if (!$workflow) {
            return redirect('approver/procurement')->with('error', 'No pending workflow entry found for this document.');
        }

        // Update the current workflow status
        $workflow->status = $request->action;
        $workflow->remark = $request->remark;
        $workflow->updated_at = now();
        $workflow->save();

        $document = ProcModel::find($id);
        $initiator = User::find($document->initiator_id);

        if ($request->action === 'Approved') {
            // Determine the next reviewer based on the current reviewer position
            $nextReviewerPosition = null;
            switch ($workflow->reviewer->position) {
                case "Head Of Department":
                    $nextReviewerPosition = "Office Superintendent";
                    break;
                case "Office Superintendent":
                    $nextReviewerPosition = "Registrar";
                    break;
                case "Registrar":
                    $nextReviewerPosition = "Principal";
                    break;
                case "Principal":
                    $nextReviewerPosition = "Store Incharge";
                    break;
                case "Store Incharge":
                    $nextReviewerPosition = "Store Keeper";
                    break;
                default:
                    $nextReviewerPosition = null;
            }

            if ($nextReviewerPosition) {
                $nextReviewer = User::where('position', $nextReviewerPosition)
                    ->first();

                if (!$nextReviewer) {
                    return redirect('approver/procurement')->with('error', 'No reviewer found for the next position: ' . $nextReviewerPosition);
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

                return redirect('approver/procurement')->with('success', 'Request accepted and forwarded to ' . $nextReviewer->position . '.');
            } else {

                // Special case: Store Keeper's final message
                if ($workflow->reviewer->position === "Store Keeper") {
                    if ($initiator) {
                        $initiatorEmailData = [
                            'recipient_name' => $initiator->name,
                            'message' => 'The purchase for your procurement document has been created by the Store Keeper.',
                            'doc_title' => $document->doc_title,
                            'doc_desc' => $document->doc_desc,
                            'status' => 'Purchase Initiated',
                            'remark' => $request->remark,
                        ];

                        // Send the procurement update email to initiator
                        Mail::to($initiator->email)->send(new ProcUpdateMail($initiatorEmailData));
                    }

                    return redirect('approver/procurement')->with('success', 'Request has been completed & Purchase request has been created.');
                }
            }
        } else if ($request->action === 'Rejected') {
            // Find the document and update its status
            $document = ProcModel::find($id);
            if ($document) {
                $document->status = 'Rejected';
                $document->save();

                // Notify the initiator of the rejection
                if ($initiator) {
                    $initiatorEmailData = [
                        'recipient_name' => $initiator->name,
                        'message' => 'Your procurement document has been rejected by ' . $workflow->reviewer->position . '.',
                        'doc_title' => $document->doc_title,
                        'doc_desc' => $document->doc_desc,
                        'status' => 'Rejected',
                        'remark' => $request->remark,
                    ];

                    Mail::to($initiator->email)->send(new ProcUpdateMail($initiatorEmailData));
                }
            }

            return redirect('approver/procurement')->with('success', 'Request rejected and returned to the initiator.');
        }
    }
}
