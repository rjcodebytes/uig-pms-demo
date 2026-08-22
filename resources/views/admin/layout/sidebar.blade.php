<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar" style="width: 250px">

  <ul class="sidebar-nav" id="sidebar-nav">

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'dashboard') collapsed @endif" href="{{ url('admin/dashboard') }}">
        <i class="bi bi-grid"></i>
        <span>Dashboard</span>
      </a>
    </li>

    <li class="nav-heading">Pages</li>

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'profile') collapsed @endif" href="{{ url('admin/profile') }}">
        <i class="bi bi-person-fill"></i>
        <span>Profile</span>
      </a>
    </li><!-- End Profile Page Nav -->

    <!-- Show Users and Roles menu only for Admin -->
    @if(Auth::user()->role === 1)
    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'users') collapsed @endif" href="{{ url('admin/users') }}">
      <i class="bi bi-people-fill"></i>
      <span>Users</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'roles') collapsed @endif" href="{{ url('admin/roles') }}">
      <i class="bi-person-bounding-box"></i>
      <span>Roles</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'departments') collapsed @endif"
      href="{{ url('admin/departments') }}">
      <i class="bi bi-diagram-3"></i>
      <span>Departments</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'positions') collapsed @endif" href="{{ url('admin/positions') }}">
      <i class="bi bi-briefcase"></i>
      <span>Positions</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link @if(Request::segment(2) != 'purchase') collapsed @endif" href="{{ url('admin/purchase') }}">
      <i class="ri-article-fill"></i>
      <span>Purchase Process</span>
      </a>
    </li>
  @endif

  </ul>

</aside><!-- End Sidebar-->
