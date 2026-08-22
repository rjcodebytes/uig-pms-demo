@extends("storekeeper.layout.app")

@section('content')
<div class="pagetitle">
  <h1>CREATED PURCHASE</h1>
</div>

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('storekeeper/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchaseview')}}">Purchase Request</a></li>
    </ol>
  </nav>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Created Purchase Requests</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Purchase ID</th>
          <th>Document ID</th>
          <th>Purchase Type</th>
          <th>Description</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @foreach($purchases as $purchase)
      <tr>
        <td>{{ $purchase->purchase_id }}</td>
        <td>{{ $purchase->document_id }}</td>
        @if($purchase->documentID && $purchase->documentID->purchaseType)
            <td>{{ $purchase->documentID->purchaseType->name }}</td>
            <td>{{ $purchase->documentID->purchaseType->description }}</td>
        @endif
        <td>{{ $purchase->start_date->format('d/m/Y') }}</td>
        <td>{{ $purchase->end_date->format('d/m/Y') }}</td>
        <td style="display:flex; justify-content:center">
        <a type="button" href="{{url('storekeeper/purchase/viewpurchaserequest/' . $purchase->purchase_id)}}"class="btn btn-primary btn-md mt-2">
          <i class="ri-file-text-fill"></i> View Request
        </a>
        </td>
      </tr>
    @endforeach
      </tbody>
    </table>
  </div>
</div>

@endsection
