define(['text!./nav-bar.html','nav-bar', 'router', 'jquery'],
    function(template, navBar, router, $) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.menus = navBar.menus;
            $(document).on('click','.navbar-collapse.in',function(e) {
                if( $(e.target).is('a') && ( $(e.target).attr('class') != 'dropdown-toggle' ) ) {
                    $(this).collapse('hide');
                }
            });
        }

        NavBarViewModel.prototype.isPageActive = function(menu) {
            var currentRoute= router.currentRoute();

            if(currentRoute){
                return menu.url.toLowerCase() === currentRoute.url.toLowerCase();
            }

            return false;
        };

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });