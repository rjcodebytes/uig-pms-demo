@extends("admin.layout.app")

@section('content')

    <div class="pagetitle">
      <h1>USERS</h1>
    </div>

    @include('_message')

    <section class="section dashboard">

        <div class="card">

            <div class="card-body">
                <div class="row">
                    <div class="col-md-6"><h5 class="card-title">User List</h5></div>
                    <div class="col-md-6 mt-3" style="text-align: right"><a type="button" href="{{ url('admin/users/createuser')}}" class="btn btn-outline-primary">Add User</a></div>
                </div>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $user)
                            <tr>
                                <th scope="row">{{ $user->id }}</th>
                                <td>{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                <td>{{ $user->role_name }}</td>
                                <td>
                                    <div class="btn-group gap-1" role="group" aria-label="Basic mixed styles example">

                                        <a href="{{ url('admin/users/edituser/'.$user->id) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <a href="{{ url('admin/users/deleteuser/'.$user->id) }}" class="btn btn-danger btn-sm">Delete</a>

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
