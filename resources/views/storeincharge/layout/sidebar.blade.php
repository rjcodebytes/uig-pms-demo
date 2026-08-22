<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar" style="width: 250px">

    <ul class="sidebar-nav" id="sidebar-nav">

        <li class="nav-item">
          <a class="nav-link @if(Request::segment(2) != 'dashboard') collapsed @endif" href="{{ url('storeincharge/dashboard') }}">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <li class="nav-heading">Pages</li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'profile') collapsed @endif" href="{{ url('storeincharge/profile') }}">
            <i class="bi bi-person-fill"></i>
            <span>Profile</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'purchase') collapsed @endif" href="{{ url('storeincharge/purchase') }}">
            <i class="bi bi-person-fill"></i>
            <span>Purchase Process</span>
            </a>
        </li><!-- End Profile Page Nav -->

    </ul>

  </aside><!-- End Sidebar-->
