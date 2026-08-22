<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar col-md-2" style="width: 250px;">

    <ul class="sidebar-nav" id="sidebar-nav">

        <li class="nav-item">
          <a class="nav-link @if(Request::segment(2) != 'dashboard') collapsed @endif" href="{{ url('initiator/dashboard') }}">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <li class="nav-heading">Pages</li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'profile') collapsed @endif" href="{{ url('initiator/profile') }}">
            <i class="bi bi-person-fill"></i>
            <span>Profile</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'procurement') collapsed @endif" href="{{ url('initiator/procurement') }}">
                <i class="ri-article-fill"></i>
            <span>Procurrement</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(1) != 'contact') collapsed @endif" href="{{ url('/contact') }}">
                <i class="bi bi-envelope"></i>
            <span>Contact</span>
            </a>
        </li>
    </ul>

  </aside><!-- End Sidebar-->
