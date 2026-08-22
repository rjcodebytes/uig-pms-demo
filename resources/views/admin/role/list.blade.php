@extends("admin.layout.app")

@section('content')

    <div class="pagetitle">
      <h1>ROLES</h1>
    </div>

    @include('_message')

    <section class="section dashboard">

        <div class="card">

            <div class="card-body">
                <div class="row">
                    <div class="col-md-6"><h5 class="card-title">User Role</h5></div>
                    <div class="col-md-6 mt-3" style="text-align: right"><a type="button" href="{{ url('admin/roles/add')}}" class="btn btn-outline-primary">Add Role</a></div>
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

                        @foreach($getRecords as $role)
                            <tr>
                                <th scope="row">{{ $role->id }}</th>
                                <td>{{ $role->name }}</td>
                                <td>{{ $role->created_at }}</td>
                                <td>
                                    <div class="btn-group gap-1" role="group" aria-label="Basic mixed styles example">

                                        <a href="{{ url('admin/roles/edit/'.$role->id) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <a href="{{ url('admin/roles/delete/'.$role->id) }}" class="btn btn-danger btn-sm">Delete</a>

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
