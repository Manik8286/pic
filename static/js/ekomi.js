(function(){
                   eKomiIntegrationConfig = new Array(
                           {certId:'0EBF73D6520C120'}
                   );
                   if(typeof eKomiIntegrationConfig != "undefined"){for(var eKomiIntegrationLoop=0;eKomiIntegrationLoop<eKomiIntegrationConfig.length;eKomiIntegrationLoop++){
                           var eKomiIntegrationContainer = document.createElement('script');
                           eKomiIntegrationContainer.type = 'text/javascript'; eKomiIntegrationContainer.defer = true;
                           eKomiIntegrationContainer.src = (document.location.protocol=='https:'?'https:':'http:') +"//connect.ekomi.de/integration_1416217315/" + eKomiIntegrationConfig[eKomiIntegrationLoop].certId + ".js";
                           document.getElementsByTagName("head")[0].appendChild(eKomiIntegrationContainer);
                   }}else{if('console' in window){ console.error('connectEkomiIntegration - Cannot read eKomiIntegrationConfig'); }}
          })();