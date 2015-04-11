$( document ).ready(function() {
    $("header").sticky({ topSpacing: 0 });
    $('.tooltip').tooltipster({
        position: 'right'
    });
    adjustNavAreaHeight();
});

// function to toggle on/off item (should be a string)
function toggleVisibility(item) {
    // get the item's classes ...
    var chosen = $(item);

    // toggle the text area with mild animation
    // chosen.toggle(600, 'swing');
    chosen.toggle({
        duration: 600,
        easing: 'swing', // 'swing' is the default, so it doesn't need to be set
    });

    // Developer note:
    // Tried using code below, which is supposed to call the function after the animation completes
    //       chosen.toggle(600, 'swing', adjustNavIcons(item));
    // but, I don't believe it is working properly. Using a timeout for now.

    // wait for toggle to finish, then reposition navigation icons
    setTimeout(function() {
        adjustNavIcons(item);
    }, 650);
}

// lines up navigation icons with associated section (if displayed)
function adjustNavIcons (selectedItem) {
    // adjust the navigation icon location if
    // the associated section is visible
    var navIcons = $('nav li');
    var navIcon;
    var navSection;
    var iconPosY;
    var sectionPosY;
    var newPadding;
    for (i=0; i<navIcons.length; i++) {
        newPadding = 0; // default
        navSection = $("#" + navIcons[i].id + "-desc");
        // reset section padding to 0 (may have been previously set)
        navSection.css("padding-top", "0px");

        navIcon = $("#" + navIcons[i].id);
        // Developer note ... need to set navIcon in order to use it to get the position.
        // Not quite sure why, but this does not work:
        //    iconPosY = navIcons[i].position().top;
        // navIcons[i] is not the same object as navIcon

        if (navSection.is(':visible')) {
            // get the current padding-top of icon
            var iconCurrPadding = parseInt(navIcon.css("padding-top"));

            // determine the Y position of the icon and the Y Position of the corresponding section
            iconPosY = Math.floor(navIcon.position().top + iconCurrPadding);
            sectionPosY = Math.floor(navSection.position().top);

            var positionDiff = sectionPosY - iconPosY;

            // now determine appropriate padding value
            if (positionDiff == 0) {
                // keep the current padding
                newPadding = iconCurrPadding;
            }
            else {
                // need to add/subtract padding
                newPadding = iconCurrPadding + positionDiff;
                // if padding is negative, then the icon is lower than the section and the section needs padding
                if (newPadding < 0) {
                    newPadding = 0;  // no negative icon padding allowed
                    // so, adjust the padding on the section
                    var iconPosNoPad = Math.floor(navIcon.position().top);
                    navSection.css("padding-top", (iconPosNoPad - sectionPosY) + "px");
                }
            }
        }
        // and adjust the icon css padding
        navIcon.css("padding-top", newPadding + "px");
    }
    // adjust height of nav area to match height of content area
    adjustNavAreaHeight();

    // auto scroll to selected area if now visible
    // from resource: http://www.robertprice.co.uk/robblog/2013/02/using-jquery-to-scroll-to-an-element/
    // Note: the "- 80" is to allow for the sticky header
    var chosen = $(selectedItem);
    if (chosen.is(':visible')) {
        $('html, body').animate({
            scrollTop: (chosen.offset().top - 80)
        },500);
    }
}

// adjusts the navigation area height after an item is open/closed or window resized
// developer note: this function is only needed if a background is applied to nav; otherwise not visible
function adjustNavAreaHeight () {
    // set nav height to auto so that all items are included
    $('#navigation').height('auto');

    // make nav height bigger if content section is bigger
    var contentHeight = $('main').height();
    var navHeight = $('#navigation').height();
    if (navHeight < contentHeight) {
        $('#navigation').height(contentHeight);
    }
    // adjust copyright padding-left so that it aligns with content area
    var newPadding = $('#navigation').width() + 6;
    $('#copyright').css("padding-left", newPadding + "px");
}

/******************************
*  Event Listeners
******************************/

// Item: Window
// Trigger: resize
// Action: Adjust height of navigation area

window.addEventListener("resize", adjustNavAreaHeight);
