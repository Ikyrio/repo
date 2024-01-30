window.onload = function(){
    $(".menu-item-29").removeClass("splitted");
    $(".navigation-wrapper").append(`
		 <a href="/kosik/" class="btn btn-icon toggle-window cart-count full" data-target="cart" data-testid="headerCart" rel="nofollow">
        <span class="sr-only">Nákupní košík</span>
        <i data-testid="headerCartCount">1</i>    
     </a>
  `);
}

