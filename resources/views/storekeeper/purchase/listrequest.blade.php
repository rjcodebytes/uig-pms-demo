@extends("storekeeper.layout.app")

@section('content')
<style>
  .hover-effect {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    padding: 0.5em 1em;
    /* Padding for better spacing */
  }

  .hover-effect lottie-player {
    opacity: 1;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .hover-effect .hover-text {
    opacity: 0;
    transform: translateY(-10px);
    position: absolute;
    transition: all 0.3s ease-in-out;
    padding: 0.2em 0.5em;
  }

  .hover-effect:hover lottie-player {
    opacity: 0;
    transform: translateY(10px);
  }

  .hover-effect:hover .hover-text {
    opacity: 1;
    transform: translateY(0);
  }

  .hover-effect dotlottie-player {
    opacity: 1;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .hover-effect:hover dotlottie-player {
    opacity: 0;
    transform: translateY(10px);
  }

</style>

<div class="pagetitle">
  <h1>PURCHASE REQUEST</h1>
</div>

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('storekeeper/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchase')}}">Purchase Request</a></li>
    </ol>
  </nav>
</div>

@include('_message')

<section class="section dashboard">

  <div class="card">

    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h5 class="card-title">List Of Approved Procurements</h5>
        </div>
      </div>

    @if ($showFilter)
      <div class="container mt-4">
      <form method="GET" action="{{ url('storekeeper/purchase') }}" class="d-flex align-items-center">
        <label for="departmentFilter" class="me-2 fw-bold">Filter by Department:</label>
        <select name="department" id="departmentFilter" class="form-select w-auto me-2" onchange="this.form.submit()">
        <option selected>Department</option>
        @foreach($departments as $department)
            <option value="{{ $department->name }}" {{ request('department') == $department->name ? 'selected' : '' }}>
                {{ $department->name }}
            </option>
        @endforeach
        </select>
      </form>
      </div>
    @endif

    @if($workflows->isNotEmpty())
      <table class="table table-bordered table-striped mt-3" style="scale:.95">
      <thead style="text-align: center;">
        <tr>
        <th style="width: 8%;">Doc ID</th>
        <th style="width: 24%;">Title</th>
        <th style="width: 14%;">Initiator</th>
        <th style="width: 12%;">Department</th>
        <th style="width: 14%;">Uploaded On</th>
        <th style="width: 10%;">Status</th>
        <th style="width: 14%;">Action</th>
        </tr>
      </thead>
      <tbody>
        @foreach($workflows as $workflow)
        @php
        $document = $workflow->document;
        $initiator = $document->initiator;
        $dept = $initiator->dept;
    @endphp
        <tr>
        <th scope="row" style="text-align: center">DOC0{{  $document->doc_id  }}</th>
        <td>{{ $document->doc_title }}</td>
        <td>{{ $initiator->name}}</td>
        <td>{{ $dept->name }}</td>
        <td>{{ $document->created_at->format('d/m/Y') }}</td>
        <td style="text-align: center">
            @if ($workflow->status == 'Pending')
                Pending Purchase.
            @elseif ($workflow->status == 'Approved')
                Purchase Request Created.
            @endif

        </td>
        <td style="text-align: center; display:flex; justify-content: space-evenly;">

          <a type="button" href="{{ url('storekeeper/purchase/view/' . $document->doc_id) }}"
          class="btn btn-primary btn-md mt-2 hover-effect">
          <script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
          <lottie-player src="https://lottie.host/20619866-c992-4506-aea2-53be365ebddc/UgTspMO7gH.json"
          background="transparent" speed="1" style="width: 24px; height: 24px" loop="false"
          autoplay></lottie-player>
          <span class="hover-text">View</span>
          </a>
          @if ($workflow->status != "Approved")
            <a type="button" href="{{ url('storekeeper/purchase/startpurchase/' . $document->doc_id) }}"
            class="btn btn-secondary btn-md mt-2 hover-effect">
            <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
            type="module"></script>
            <dotlottie-player src="https://lottie.host/cdb4dfd3-5f32-4eb2-a3dc-2335863f3886/wQ2RsLO7Q0.lottie"
            background="transparent" speed="1" style="width: 24px; height: 24px;scale:1.5" loop
            autoplay></dotlottie-player>
            <span class="hover-text" style="font-size: 10px;">Start Purchase</span>
            </a>
          @endif

        </td>
        </tr>
    @endforeach
      </tbody>
      </table>
    @else
      <p>No Pending request found.</p>
    @endif

    </div>
  </div>
</section>


@endsection
