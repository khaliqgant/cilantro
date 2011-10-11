require [
        'cilantro/types/report/main'
        # needs to be ported
        'cilantro/report/table'
        'cilantro/report/columns'
    ],
        
    (Report, m_table, m_columns) ->

        sessionReport = new Report.Models.Session

        $ ->
            ReportEditor = new Report.Views.Editor

            ReportName = new Report.Views.Name
                model: sessionReport

            sessionReport.fetch()

            m_columns.init()
            m_table.init()

            e = $('#export-data')

            e.bind 'click', ->
                e.attr('disabled', true)
                window.location = App.urls.session.report + '?f=csv'
                setTimeout ->
                    e.attr('disabled', false)
                , 5000
                return false