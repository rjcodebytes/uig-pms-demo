<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar" style="width: 250px">

    <ul class="sidebar-nav" id="sidebar-nav">

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'dashboard') collapsed @endif"
                href="{{ url('storekeeper/dashboard') }}">
                <i class="bi bi-grid"></i>
                <span>Dashboard</span>
            </a>
        </li>

        <li class="nav-heading">Pages</li>

        <li class="nav-item">
            <a class="nav-link @if(Request::segment(2) != 'profile') collapsed @endif"
                href="{{ url('storekeeper/profile') }}">
                <i class="bi bi-person-fill"></i>
                <span>Profile</span>
            </a>
        </li>

        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle @if(Request::segment(2) != 'purchase') collapsed @endif"
                href="{{ url('storekeeper/purchase') }}" id="purchaseDropdown" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi bi-person-fill"></i>
                <span>Purchase Process</span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="purchaseDropdown">
                <li>
                    <a class="dropdown-item" href="{{ url('storekeeper/purchase') }}">
                        Create Purchase Request
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="{{ url('storekeeper/purchase/view') }}">
                        View Purchase Request
                    </a>
                </li>
            </ul>
        </li>
        <!-- End Profile Page Nav -->

    </ul>

</aside><!-- End Sidebar-->
