@extends("approver.layout.app")

@section('content')

<div class="pagetitle">
  <h1>Purchase Process Type</h1>
</div>
<section class="section">
  @include('_message')
  <div class="card">
    <div class="card-body">
      <div class="row">

        <div class="col-md-6">
          <h5 class="card-title">Purchase Process Type List</h5>
        </div>

        <div class="col-md-6 mt-3" style="text-align: right"><a type="button" href="{{ url('approver/purchase/add')}}"
            class="btn btn-outline-primary">Add Purchase Type</a></div>
        </div>

        <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>

                        @foreach($getRecords as $ptypename)
                            <tr>
                            <th scope="row">{{ $loop->iteration }}</th>
                                <td>{{ $ptypename->name }}</td>
                                <td>{{ $ptypename->description }}</td>
                                <td>{{ $ptypename->created_at }}</td>
                                <td>
                                    <div class="btn-group gap-1" role="group" aria-label="Basic mixed styles example">

                                        <a href="{{ url('admin/purchase/edit/'.$ptypename->name) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <a href="{{ url('admin/purchase/delete/'.$ptypename->name) }}" class="btn btn-danger btn-sm">Delete</a>

                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>


      </di>
    </div>
</section>

@endsection
