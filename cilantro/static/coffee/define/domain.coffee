define ['common/models/state', 'common/views/state', 'common/views/collection'], (statemodel, stateview, collectionview) ->
    ###
    A Domain is a high-level organization for concepts. Only a single domain
    can be active at any given time.

    A domain can have subdomains associated with it. If this is the case, it
    will act as a delegate to those subdomains.
    ###

    class Domain extends statemodel.Model

    ###
    The DomainCollection encapsulates cross-instance logic.
    ###

    class DomainCollection extends Backbone.Collection
        model: Domain
        url: App.urls.domains

        initialize: ->
            @bind 'active', @activate
            @bind 'inactive', @inactivate

            App.hub.subscribe 'domain/request', (id) =>
                domain = @get id
                if domain
                    domain.activate()
                else
                    subdomain = @subdomains.get id
                    domain = @get subdomain.get('parent').id
                    domain.activate()
                    subdomain.activate()


        # override parse to differentiate domains from subdomains. all domains
        # without a parent will be returned to be added to this collection. all
        # other domains will be added to a ``SubdomainCollection``
        parse: (resp, xhr) ->
            groups = _.groupBy resp, (obj) -> obj['parent']?.id or null

            @subdomains = new SubdomainCollection
            new SubdomainCollectionView
                collection: @subdomains

            domains = groups['null']
            delete groups['null']

            subdomains = _.flatten _.values groups
            for key of groups
                id = parseInt(key)
                subdomains.push id: id, name: 'All', parent: id: id

            @subdomains.reset subdomains

            return domains


        activate: (model) ->
            App.hub.publish 'domain/active', model.id

            # get active models (without the current one), and deactivate them
            @chain().without(model).map (model) -> model.inactivate()
        
        inactivate: (model) ->
            App.hub.publish 'domain/inactive', model.id


    ###
    The DomainView handles setting up DOM event handlers for each Domain
    instance that exists.
    ###

    class DomainView extends stateview.View
        el: '<span role="domain">
                <div class="icon"></div><span role="name"></span>
            </span>'

        elements:
            'span': 'name'

        events:
            'click': 'click'

        render: ->
            name = @model.get 'name'
            @el.attr('id': "tab-#{name.toLowerCase()}")
            @name.text @model.get 'name'
            @

        # primary handler that interfaces with the global App.State. the
        # visual changes will be invoked via this view's collection view
        click: (event) =>
            @model.activate()



    class DomainCollectionView extends collectionview.View
        el: '#domains'
        viewClass: DomainView


    class Subdomain extends Domain


    class SubdomainCollection extends DomainCollection
        model: Subdomain

        initialize: ->
            # when a domain is activated, only the concepts under that
            # domain are made visible
            App.hub.subscribe 'domain/active', @toggleEnableByDomain

            # on every reset, regroup all concepts by their respective domain
            @bind 'reset', @groupByDomain

            # when any model changes it's ``active`` state, deactivate all other
            # concepts within the same domain
            @bind 'active', @activate
            @bind 'inactive', @inactivate


        comparator: (model) -> model.id

        # which subdomains can be active and deactivated depend on the domain
        # they are associated with. only subdomains within the domain need
        # to be deactivated since the other domains are not visible
        groupByDomain: ->
            @_byDomain = @groupBy (model) -> model.get('parent').id

        # enables/disables concepts given their domain. the last concept that was
        # active from the newly visible concepts is re-activated.
        toggleEnableByDomain: (id) =>
            active = false
            @map (model) =>
                if model.get('parent').id is id
                    model.enable reactivate: true
                    if model.isActive() then active = true
                else
                    model.disable()

            # fallback to the "All" domain
            if not active and @_byDomain[id]
                @get(id).activate()

        # performs some collection-level handling for the newly active model.
        # all concepts within the same domain as the current model are
        # deactivated
        activate: (model) ->
            App.hub.publish 'subdomain/active', model.id

            # deactivate all models from the same domain
            _(@_byDomain[model.get('parent').id]).without(model)
                .map (model) -> model.inactivate()

        inactivate: (model) ->
            App.hub.publish 'subdomain/inactive', model.id


    class SubdomainView extends DomainView
        el: '<span role="name"></span>'
        render: ->
            @el.text @model.get 'name'
            @


    class SubdomainCollectionView extends DomainCollectionView
        el: '#subdomains'
        viewClass: SubdomainView

        initialize: ->
            super
            # when a domain is activated, only the concepts under that
            # domain are made visible
            App.hub.subscribe 'domain/active', @toggleEnableByDomain

        toggleEnableByDomain: (id) =>
            if not @collection._byDomain[id]
                if not @el.is(':hidden') then @el.fadeTo(100, 0).slideUp('fast')
            else if @el.is(':hidden')
                @el.slideDown('fast').fadeTo(100, 1)

    return {
        Model: Domain
        Collection: DomainCollection
        View: DomainView
        CollectionView: DomainCollectionView
    }

