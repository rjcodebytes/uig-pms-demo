@extends('initiator.layout.app')

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
</style>

<div class="pagetitle">
  <h3>PROCUREMENT</h3>
</div>

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('initiator/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('initiator/procurement')}}">Procurement</a></li>
    </ol>
  </nav>
</div>

@include('_message')

<section class="section dashboard">

  <div class="card">

    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h5 class="card-title">Procurement List</h5>
        </div>
        <div class="col-md-6 mt-3" style="text-align: right"><a type="button"
            href="{{ url('initiator/procurement/create')}}" class="btn btn-outline-primary">Create Procurement</a></div>
      </div>

    @if($documents->isNotEmpty())
      <table class="table table-bordered table-striped mt-3" style="scale:.94">
        <thead style="text-align: center ;">
          <tr>
            <th style="width: 8%;">Doc ID</th>
            <th style="width: 20%;">Title</th>
            <th style="width: 34%;">Description</th>
            <th style="width: 14%;">Uploaded On</th>
            <th style="width: 12%;">Status</th>
            <th style="width: 13%;">Action</th>
          </tr>
        </thead>
        <tbody>
          @foreach($documents as $document)
        <tr>
        <th scope="row" style="text-align: center">{{  $document->doc_id  }}</th>
        <td>{{ $document->doc_title }}</td>
        <td>{{ $document->doc_desc }}</td>
        <td style="text-align: center">{{ $document->created_at->format('d/m/Y') }}</td>
        <td style="text-align: center">
        @if($document->latestWorkflow && $document->latestWorkflow->reviewer)
            @if($document->latestWorkflow->reviewer->id === 11 && $document->latestWorkflow->status === "Approved")
                Purchase process started.
            @else
                Pending at {{ $document->latestWorkflow->reviewer->position }}
            @endif
        @else
            N/A
        @endif
        </td>
        <td style="text-align: center;display:flex ;justify-content: space-evenly;">

          <a style="position: relative;" type="button"
          href="{{ route('document.view', ['id' => $document->doc_id]) }}" target="_blank"
          class="btn btn-secondary btn-md mt-2 hover-effect">
          <script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
          <lottie-player src="https://lottie.host/20619866-c992-4506-aea2-53be365ebddc/UgTspMO7gH.json"
            background="transparent" speed="1" style="width: 24px; height: 24px" loop autoplay></lottie-player>
          <span class="hover-text">View</span>
          </a>


          <a style="position: relative;" type="button"
          href="{{ url('initiator/procurement/track/' . $document->doc_id) }}"
          class="btn btn-primary btn-md mt-2 hover-effect">
          <script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
          <lottie-player src="https://lottie.host/99e8ab12-460c-4222-9c00-6214d20297bc/Az5H1JmSDK.json"
            background="transparent" speed="1" style="width: 24px; height: 24px" loop autoplay
            ></lottie-player>
          <span class="hover-text">Track</span>
          </a>


        </td>
        </tr>
      @endforeach
        </tbody>
      </table>
      @else
        <p>No document found.</p>
    @endif
    </div>
  </div>
</section>

@endsection
