@extends("admin.layout.app")

@section('content')

    <div class="pagetitle">
      <h1>DEPARTMENTS</h1>
    </div>

    @include('_message')

    <section class="section dashboard">

        <div class="card">

            <div class="card-body">
                <div class="row">
                    <div class="col-md-6"><h5 class="card-title">User Department</h5></div>
                    <div class="col-md-6 mt-3" style="text-align: right"><a type="button" href="{{ url('admin/departments/add')}}" class="btn btn-outline-primary">Add Department</a></div>
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

                        @foreach($getRecords as $department)
                            <tr>
                                <th scope="row">{{ $loop->iteration }}</th>
                                <td>{{ $department->name }}</td>
                                <td>{{ $department->created_at }}</td>
                                <td>
                                    <div class="btn-group gap-1" role="group" aria-label="Basic mixed styles example">

                                        <a href="{{ url('admin/departments/edit/'.$department->name) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <a href="{{ url('admin/departments/delete/'.$department->name) }}" class="btn btn-danger btn-sm">Delete</a>

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
