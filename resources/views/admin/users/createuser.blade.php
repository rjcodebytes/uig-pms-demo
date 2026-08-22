@extends('admin.layout.app')

@section('style')
    <style>
        /* Hide the department and position selects by default */
        #department-container {
            display: none;
        }
    </style>
@endsection

@section('content')

<div class="pagetitle">
    <h1>USERS</h1>
</div>

<div class="container">

    <section class="section d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-8 d-flex flex-column align-items-center justify-content-center">
            <div class="card mb-3">
                <div class="card-body">

                    <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Create a User</h5>
                    <p class="text-center small">Enter user details to create an account</p>
                    </div>

                    <form class="row g-3" action="" method="post">
                        {{ csrf_field() }}

                        <div class="col-12">
                            <label for="name" class="form-label">Name</label>
                            <input style="transition:.3s" type="text" name="name" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="email" class="form-label">Email</label>
                            <input style="transition:.3s" type="email" name="email" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="mobile" class="form-label">Mobile</label>
                            <input style="transition:.3s" type="number" name="mobile" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="gender" class="form-label">Gender</label>
                            <select class="form-select" name="gender" required>
                                <option selected disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label for="username" class="form-label">Username</label>
                            <input style="transition:.3s" type="text" name="username" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="password" class="form-label">Password</label>
                            <input style="transition:.3s" type="password" name="password" class="form-control" required>
                        </div>

                        <div class="col-12 pt-2">
                            <label for="role" class="form-label">Role</label>
                            <select class="form-select" id="role" name="role" required>
                                <option selected disabled>Select Role</option>
                                @foreach($getRoles as $role)
                                    <option value="{{ $role->id }}">{{ $role->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="col-12 pt-2" id="position-container">
                            <label for="position" class="form-label">Position</label>
                            <select class="form-select" id="position" name="position">
                                <option selected disabled>Select Position</option>
                                @foreach($getPos as $position)
                                    <option value="{{ $position->name }}">{{ $position->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="col-12 pt-2" id="department-container">
                            <label for="department" class="form-label">Department</label>
                            <select class="form-select" id="department" name="department">
                                <option selected disabled>Select Department</option>
                                @foreach($getDept as $department)
                                    <option value="{{ $department->name }}">{{ $department->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="text-center pt-2">
                            <button type="submit" class="btn btn-primary">Create User</button>
                            <a type="cancel" href="{{ url()->previous() }}" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>

                </div>
            </div>
          </div>
        </div>
      </div>

    </section>

</div>

@endsection

@section('script')
<script>
    const roleSelect = document.getElementById('role');
    const positionSelect = document.getElementById('position');
    const departmentContainer = document.getElementById('department-container');
    const positionContainer = document.getElementById('position-container');
    // Add an event listener to monitor changes in the role select
    roleSelect.addEventListener('change', function () {
        const selectedRole = roleSelect.options[roleSelect.selectedIndex]?.text.toLowerCase();
        // Show/hide department select based on role
        if (selectedRole === 'initiator') {
            departmentContainer.style.display = 'block';
        } else {
            departmentContainer.style.display = 'none';
            document.getElementById('department').value = ''; // Clear the department field
        }
        // Show/hide position select based on role
        if (selectedRole === 'approver' || selectedRole === 'initiator') {
            positionContainer.style.display = 'block';
        } else {
            positionContainer.style.display = 'none';
            document.getElementById('position').value = ''; // Clear the position field
        }
    });
    positionSelect.addEventListener('change', function () {
    const selectedPosition = positionSelect.options[positionSelect.selectedIndex]?.text.toLowerCase();
    // Show/hide department select based on position
    if (['head of department', 'lab assistant', 'assistant professor'].includes(selectedPosition)) {
        departmentContainer.style.display = 'block';
    } else {
        departmentContainer.style.display = 'none';
        document.getElementById('department').value = ''; // Clear the department field
    }
});
</script>
@endsection
