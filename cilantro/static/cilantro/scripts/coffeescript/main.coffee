define [
    'cilantro/core'
    'cilantro/utils/logging'
    'order!vendor/jquery.ui'
    'order!vendor/jquery.idle'
    'order!vendor/jquery.jqote2'
    'order!vendor/jquery.block'
    'order!vendor/jquery.scrollto'
    'order!cilantro/utils/ajaxsetup'
    'order!cilantro/utils/extensions'
    'order!cilantro/utils/sanitizer'
], (Core, Logging) ->
    # IE 7...
    if not window.JSON then require ['vendor/json2']

    # configure jQuery block plugin..
    $.block.defaults.message = null
    $.block.defaults.css = {}
    $.block.defaults.overlayCSS = {}

    # post-init App setup
    App.Log = new Logging.Log
    App.LogView = new Logging.LogView

    # basic client-side session timer
    $.idleTimer 10 * 1000

    $(document).bind
        'idle.idleTimer': ->
            App.hub.publish 'session/idle'

        'active.idleTimer': ->
            App.hub.publish 'session/resume'


    $(window).on 'beforeunload', ->
        if $.active
            return "Whoa you're quick! We are saving your stuff,
                it will only take a moment."
