@extends('initiator.layout.app')

@section("content")

<div class="pagetitle">
    <h3>PROCUREMENT</h3>
</div>

<div class="pagetitle">
    <nav>
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ url('initiator/dashboard')}}">Home</a></li>
            <li class="breadcrumb-item active"><a href="{{ url('initiator/procurement')}}">Procurement</a></li>
            <li class="breadcrumb-item active"><a href="#">Track Procurement</a></li>
        </ol>
    </nav>
</div>

@include('_message')

<section class="section dashboard">

    <div class="card">
        <div class="card-body">

            <div class="pt-4 pb-2">
                <h5 class="card-title text-center pb-0 fs-4">Document Details</h5>
                <p class="text-center small">View and manage document information</p>
            </div>

            @include('initiator.procurement.trackbar')

            @section("script")

            <script>
                const workflowData = @json($workflowData);

                // Call your JavaScript function and pass the workflowData
                updateProgressBar(workflowData);

                // Call the function to set visibility based on initial classes
                updateAlertVisibility();

            </script>

            @endsection

            <div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="card-title"></h5>
                        </div>
                    </div>

                    <table class="table table-bordered table-striped mt-3">
                        <thead style="text-align: center ;">
                            <tr>
                                <th style="width: 40%;">Remark</th>
                                <th style="width: 20%;">Action</th>
                                <th style="width: 20%;">Designation</th>
                                <th style="width: 20%;">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($workflowData as $workflow)
                                <tr>
                                    <td scope="row">{{ $workflow['remark'] }}</td>
                                    <td style="text-align: center">
                                        @if ($workflow['status'] === 'Approved' && $workflow['position'] != "Store Keeper")
                                            Forwarded For Approval
                                        @elseif ($workflow['status'] === 'Pending')
                                            Pending Approval
                                        @elseif ($workflow['status'] === 'Rejected')
                                            Sent Back To Initiator
                                        @elseif ($workflow['status'] === 'Approved' && $workflow['position'] === "Store Keeper")
                                            Purchase started
                                        @endif
                                    </td>
                                    <td style="text-align: center">{{ $workflow['position'] }}</td>
                                    <td style="text-align: center">{{ $workflow['date'] }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>

                </div>
            </div>

            <!-- Document Metadata -->
            <div class="mb-4">
                <div class="card-body">
                    <h5 class="card-title">Document Metadata</h5>
                    <div class="row">
                        <div class="col-md-3">
                            <p><strong>Document ID:</strong> DOC{{$document->doc_id}}</p>
                        </div>
                        <div class="col-md-5">
                            <p><strong>Title:</strong> {{$document->doc_title}}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>Uploaded On:</strong> {{$document->created_at->format('d/m/Y') }}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <p><strong>Uploaded By:</strong> {{$initiator->name}}</p>
                        </div>
                        <div class="col-md-5">
                            <p><strong>Department:</strong> {{$initiator->department}}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>Status:</strong>

                            @php
    $latestStatus = DB::table('workflow')
                    ->where('document_id', $document->doc_id)
                    ->orderBy('updated_at', 'desc')
                    ->first();
@endphp

                       @if ($latestStatus->status=='Pending')
                          {{$latestStatus->status}} at {{$workflow['position']}}

                       @elseif ($latestStatus->status=='Approved')
                          {{$latestStatus->status}} by {{$workflow['position']}}

                       @else($latestStatus->status=='Rejected')
                          {{$latestStatus->status}} by {{$workflow['position']}}

                       @endif
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Details Table -->
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Additional Details</h5>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Description</td>
                                    <td>{{$document->doc_desc}}</td>
                                </tr>
                                <tr>
                                    <td>Purchase Type</td>
                                    <td>{{$purchase_type->name}}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{{$purchase_type->description}}</td>
                                </tr>
                                <tr>
                                    <td>Estimated Cost</td>
                                    <td>Rs. {{$purchase_type->estimated_cost}}</td>
                                </tr>
                                <tr>
                                    <td>Last Updated</td>
                                    <td>{{$document->updated_at->format('d/m/Y')}}
                                        {{$document->updated_at->format('H:i:s')}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center mt-4">
                <a class="btn btn-primary {{ $document->status === 'Rejected' ? '' : 'disabled' }}"
                    href="{{url('initiator/procurement/edit/' . $document->doc_id)}} ">Edit Document</a>
                <a class="btn btn-danger {{ $document->status === 'Rejected' ? '' : 'disabled' }}" href="{{url('initiator/procurement/delete/' . $document->doc_id)}} ">Delete Document</a>
                <a href="{{ url('initiator/procurement') }}" class="btn btn-secondary">Back to List</a>
            </div>

        </div>
    </div>
    </div>
    </div>
    </div>

</section>

</div>
@endsection
