define ['environ', 'jquery', 'underscore', 'charts', 'charts/utils'], (environ, $, _, Backbone, Charts) ->




    $ ->

    ###
    $ ->
        xField = $('[name=x-field]')
        yField = $('[name=y-field]')
        distinctField = $('[name=distinct-field]')
        clusterField = $('[name=cluster-field]')

        view = null

        # FIll in the options
        $.ajax
            url: '/api/fields/'
            success: (resp) ->
                xField.append '<option value=>---</option>'
                yField.append '<option value=>---</option>'
                clusterField.append '<option value=>---</option>'

                for field in resp
                    elemString = "<option data-type=#{field.data.type} data-enumerable=#{field.data.enumerable} value=#{field.id}>#{field.name} [#{field.model_name}]</option>"
                    xField.append(elemString).data(field)
                    yField.append(elemString).data(field)

                    if field.data.enumerable
                        clusterField.append(elemString).data(field)


        class DataField extends Backbone.Model

        updateChart = $('#update-chart').on 'click', (event) ->
            event.preventDefault()

            xOption = xField.children('[selected]')
            yOption = yField.children('[selected]')
            cOption = clusterField.children('[selected]')

            if xOption.attr 'value'
                x = new DataField
                    id: xOption.attr 'value'
                    name: xOption.text()
                    type: xOption.data 'type'
                    enumerable: xOption.data 'enumerable'

            if yOption.attr 'value'
                y = new DataField
                    id: yOption.attr 'value'
                    name: yOption.text()
                    type: yOption.data 'type'
                    enumerable: yOption.data 'enumerable'

            if cOption.attr 'value'
                c = new DataField
                    id: cOption.attr 'value'
                    name: cOption.text()
                    type: cOption.data 'type'
                    enumerable: cOption.data 'enumerable'

            if x
                url = urlTemplate id: x.id
            else if y
                url = urlTemplate id: y.id
            else
                return

            series = null
            fields = []
            data = ''

            if x
                fields.push x
                data += 'dimension=' + x.id + '&'
            if y
                fields.push y
                data += 'dimension=' + y.id + '&'
            if c
                seriesIdx = if y then 2 else 1
                data += 'dimension=' + c.id

            chart = $('.chart')[0]

            $.ajax
                url: url
                data: data
                success: (resp) ->
                    if view then view.chart.destroy()
                    if resp.clustered
                        $('#cluster-notice').fadeIn()
                    else
                        $('#cluster-notice').hide()
                    options = chartUtils.processResponse(resp, fields, seriesIdx)
                    $('.chart-title').text(options.title.text)
                    options.title.text = ''
                    chart = new Backbone.Chart
                        el: chart
                        options: options
                    chart.render()

    ###
    
