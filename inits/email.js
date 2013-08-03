var avril = require('avril')
    , appConfig = avril.getConfig('app')
, emailService = avril.require('services.email');

emailService.send(appConfig.serverName + 'yaryin meal restart .', appConfig.serverName + ' restart date : ' + new Date(), appConfig.serverErrorNotifyEmail);