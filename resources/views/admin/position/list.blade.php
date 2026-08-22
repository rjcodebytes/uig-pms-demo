@extends("admin.layout.app")

@section('content')

    <div class="pagetitle">
      <h1>POSITIONS</h1>
    </div>

    @include('_message')

    <section class="section dashboard">

        <div class="card">

            <div class="card-body">
                <div class="row">
                    <div class="col-md-6"><h5 class="card-title">User Position</h5></div>
                    <div class="col-md-6 mt-3" style="text-align: right"><a type="button" href="{{ url('admin/positions/add')}}" class="btn btn-outline-primary">Add Position</a></div>
                </div>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Date & Time</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>

                        @foreach($getRecords as $position)
                            <tr>
                                <th scope="row">{{ $loop->iteration }}</th>
                                <td>{{ $position->name }}</td>
                                <td>{{ $position->created_at }}</td>
                                <td>
                                    <div class="btn-group gap-1" role="group" aria-label="Basic mixed styles example">

                                        <a href="{{ url('admin/positions/edit/'.$position->name) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <a href="{{ url('admin/positions/delete/'.$position->name) }}" class="btn btn-danger btn-sm">Delete</a>

                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

            </div>
          </div>
    </section>
@endsection
