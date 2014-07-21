
var scrap = function scrap (idCandidato, idProceso, idOrgPolitica) {

    //creacion de objeto candidato
    var objCandidatoBE = new Object();

    //Beh, no hace daño
    String.prototype.right = function (n) {
        return this.substr((this.length - n), this.length);
    };
    //Beh, me da flojera borrarlo
    objCandidatoBE.objProcesoElectoralBE = new Object();
    objCandidatoBE.objOpInscritasBE = new Object();
    objCandidatoBE.objAmbitoBE = new Object();
    objCandidatoBE.objCargoAutoridadBE = new Object();
    objCandidatoBE.objUbigeoPostulaBE = new Object();
    objCandidatoBE.objUbigeoNacimientoBE = new Object();
    objCandidatoBE.objUbigeoResidenciaBE = new Object();
    objCandidatoBE.objUsuarioBE = new Object();
    //--

    var strMsgHastaActualidad = 'Hasta la actualidad';

    var lista_datos = {};

    var imprimeDato = function imprime_dato(tipo,cadena)
    {
        lista_datos[tipo] = cadena;
    };

    var formatNumber = function formatNumber(number, decimal) {
        return parseFloat(Math.round(number * 100) / 100).toFixed(decimal);
    };
    var objPerfilUsuarioBEnew = new Object();

    //candidato
    objCandidatoBE.objOpInscritasBE.intCod_OP = idOrgPolitica.toString();
    objCandidatoBE.objProcesoElectoralBE.intIdProceso = idProceso.toString();
    objCandidatoBE.intId_Candidato = idCandidato.toString();

    //Para borrar
    var objOPInscritasBE = new Object();
    objOPInscritasBE.objProcesoElectoralBE = new Object();
    objOPInscritasBE.intCod_OP = idOrgPolitica.toString();
    objOPInscritasBE.objProcesoElectoralBE.intIdProceso = idProceso.toString();
    //--
    
    //Verifica si existe candidato
    $.ajax({
        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoListarPorID",
        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (jsondata) {
            if (jsondata.d) {
                

                var objCandidato = new Object();
                objCandidato = jsondata.d;

                // Datos principales

                var dicPostulacion = {
                    //Cargo al que postula
                    cargo: objCandidato.objCargoAutoridadBE.strCargoAutoridad,
                    //Lugar al que postula
                    lugar: (objCandidato.objUbigeoPostulaBE.strDepartamento + ' - ' + objCandidato.objUbigeoPostulaBE.strProvincia + ' - ' + objCandidato.objUbigeoPostulaBE.strDistrito),
                    //Forma de designación
                    designacion: objCandidato.strFormaDesignacion,
                };
                imprimeDato("postulacion", dicPostulacion);

                var dicDatosPersonales = {
                    dni: objCandidato.strDNI,
                    apellidoPaterno: objCandidato.strAPaterno.toUpperCase(),
                    apellidoMaterno: objCandidato.strAMaterno.toUpperCase(),
                    nombres: objCandidato.strNombres.toUpperCase(),
                    sexo: (objCandidato.intId_Sexo?'Masculino': 'Femenino'),
                    email: objCandidato.strCorreo,
                };
                imprimeDato("datosPersonales", dicDatosPersonales);

                var dicNacimiento = {
                    fecha: (objCandidato.strFecha_Nac.substring(6, 8) + '/' + objCandidato.strFecha_Nac.substring(4, 6) + '/' + objCandidato.strFecha_Nac.substring(0, 4)),
                    pais: objCandidato.strPais,
                    departamento: objCandidato.objUbigeoNacimientoBE.strDepartamento,
                    provincia: objCandidato.objUbigeoNacimientoBE.strProvincia,
                    distrito: objCandidato.objUbigeoNacimientoBE.strDistrito,
                };
                imprimeDato("nacimiento", dicNacimiento);

                var dicResidencia = {
                    lugar: objCandidato.strResidencia,
                    departamento: objCandidato.objUbigeoResidenciaBE.strDepartamento,
                    provincia: objCandidato.objUbigeoResidenciaBE.strProvincia,
                    distrito: objCandidato.objUbigeoResidenciaBE.strDistrito,
                    //Tiempo residencia en años
                    tiempo: objCandidato.strTiempo_Residencia,
                };
                imprimeDato("residencia",dicResidencia);
                
                /* candidato familia */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoFamiliaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {
                        if (jsondata.d) {

                            var dicFamilia = {};

                            $.each(jsondata.d, function (i, item) {
                                switch (item.objTipoBE.intTipo) {
                                case 1:
                                    dicFamilia["padre"] = item.strNombres.toUpperCase();
                                    break;
                                case 2:
                                    dicFamilia["madre"] = item.strNombres.toUpperCase();
                                    break;
                                case 3:
                                    dicFamilia["conyuge"] = item.strNombres.toUpperCase();
                                    break;
                                }
                            });
                            imprimeDato("familia", dicFamilia);
                        }
                    },
                });


                /* candidato experiencia */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoExperienciaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (jsondata) {

                        if (jsondata.d.length < 1){
                            imprimeDato("experienciaLaboral", null);
                        }

                        if (jsondata.d) {
                            
                            var listaExperiencia = [];
                            $.each(jsondata.d, function (i, item) {

                                var dep = item.objUbigeoExperiencia.strUbigeo.substring(0, 2);
                                var pro = item.objUbigeoExperiencia.strUbigeo.substring(2, 4);
                                var dis = item.objUbigeoExperiencia.strUbigeo.substring(4, 6);
                                
                                var dic_laboral = {
                                    empleador:  item.strEmpleador,
                                    sector: item.objTipoSectorBE.strNombre_Sector,
                                    cargo:  item.strCargo,
                                    iniciaAnio: item.intInicioAnio,
                                    finAnio: (item.intFinAnio == 0 ? strMsgHastaActualidad : item.intFinAnio),
                                    ubicacion: (item.objUbigeoExperiencia.strDepartamento + ' - ' + item.objUbigeoExperiencia.strProvincia + ' - ' + item.objUbigeoExperiencia.strDistrito ),
                                };

                                listaExperiencia.push(dic_laboral);

                            });
                            imprimeDato("experienciaLaboral",listaExperiencia);
                        }
                        
                    }, 
                    error: function (xhr, status, error) {
                        imprimeDato("experienciaLaboral",'error');
                    }
                });

                //Educacion

                var dicEducacion = {};

                /* candidato educacion basica regular */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EducacionBasicaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {

                        if (jsondata.d) {

                            var itemcountPri = 0;
                            var itemcountSec = 0;
                            //--
                            var listaPrimaria = [];
                            var listaSecundaria = [];
                            //--

                            $.each(jsondata.d, function (i, item) {

                                var _iddepPri = item.objUbigeoPrimaria.strUbigeo.substring(0, 2);
                                var _idproPri = item.objUbigeoPrimaria.strUbigeo.substring(2, 4);
                                var _iddisPri = item.objUbigeoPrimaria.strUbigeo.substring(4, 6);
                                var _concluidoPriText = '';

                                var _iddepSec = item.objUbigeoSecundaria.strUbigeo.substring(0, 2);
                                var _idproSec = item.objUbigeoSecundaria.strUbigeo.substring(2, 4);
                                var _iddisSec = item.objUbigeoSecundaria.strUbigeo.substring(4, 6);
                                var _concluidoSecText = '';

                                switch (item.intTipoEducacion) {
                                case 1: //primaria                                       
                                    //--
                                    switch (item.strPrimaria * 1) {
                                    case 0:
                                        _concluidoPriText = 'No concluido';
                                        break;
                                    case 1:
                                        _concluidoPriText = 'Concluido';
                                        break;
                                    case 2:
                                        _concluidoPriText = 'No cuenta con estudios';
                                        break;
                                    }
                                    
                                    var dicPrimaria = {
                                        instEducativa: item.strCentroPrimaria,
                                        concluido: _concluidoPriText,
                                        periodo: (item.intAnioInicioPrimaria + ' - ' + (item.intAnioFinPrimaria == 0 ? strMsgHastaActualidad : item.intAnioFinPrimaria)),
                                    }
                                    if (item.strFgExtranjero == "1") {                                        
                                        dicPrimaria["lugar"] = item.strPais;
                                    } else {
                                        dicPrimaria["lugar"] = (item.objUbigeoPrimaria.strDepartamento + ' - ' + 
                                                                item.objUbigeoPrimaria.strProvincia + ' - ' + 
                                                                item.objUbigeoPrimaria.strDistrito);                                        
                                    }
                                    itemcountPri+=1;
                                    listaPrimaria.push(dicPrimaria);
                                    //--
                                    break;

                                case 2: //secundaria                                      
                                    //--
                                    switch (item.strSecundaria * 1) {
                                    case 0:
                                        _concluidoSecText = 'No concluido';
                                        break;
                                    case 1:
                                        _concluidoSecText = 'Concluido';
                                        break;
                                    case 2:
                                        _concluidoSecText = 'No cuenta con estudios';
                                        break;
                                    }

                                    
                                    var dicSecundaria = {
                                        instEducativa: item.strCentroSecundaria,
                                        concluido: _concluidoSecText,
                                        periodo: (item.intAnioInicioSecundaria + ' - ' + (item.intAnioFinSecundaria == 0 ? strMsgHastaActualidad : item.intAnioFinSecundaria)),
                                    }
                                    if (item.strFgExtranjero == "1") {                                        
                                        dicSecundaria["lugar"] = item.strPais
                                    } else {
                                        dicSecundaria["lugar"] = (item.objUbigeoSecundaria.strDepartamento + ' - ' +
                                                                  item.objUbigeoSecundaria.strProvincia + ' - ' +
                                                                  item.objUbigeoSecundaria.strDistrito);
                                    }
                                    itemcountSec+=1;
                                    listaSecundaria.push(dicSecundaria);
                                    //--
                                    break;

                                }

                            });

                            if (itemcountPri < 1) {dicEducacion["primaria"] = null;}
                            else {dicEducacion["primaria"] = listaPrimaria;}
                            if (itemcountSec < 1) {dicEducacion["secundaria"] = null;}
                            else {dicEducacion["secundaria"] = listaSecundaria;}
                        }

                    }, 
                    error: function (xhr, status, error) {
                        dicEducacion["primaria"] = "error";
                        dicEducacion["secundaria"] = "error";
                    }
                });

                /* candidato educacion superior */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EducacionSuperiorListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {

                        if (jsondata.d) {

                            var itemcountTec = 0;
                            var itemcountUni = 0;
                            var itemcountPos = 0;
                            
                            //--
                            var listaTecnico = [];
                            var listaUniversitario = [];
                            var listaPostgrado = [];
                            //--

                            $.each(jsondata.d, function (i, item) {
                                var dep = item.objUbigeoBE.strUbigeo.substring(0, 2);
                                var pro = item.objUbigeoBE.strUbigeo.substring(2, 4);
                                var dis = item.objUbigeoBE.strUbigeo.substring(4, 6);

                                switch (item.objTipoEstudioBE.intTipo) {
                                case 1:
                                    //tecnico
                                    itemcountTec += 1;
                                    //--
                                    var dicTecnico = {
                                        instEducativa:  item.strNombreCentro,
                                        Especialidad:  item.strNombreEstudio,
                                        curso:  item.strNombreCarrera,
                                        concluido: (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido'),
                                        periodo: (item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                    }
                                    if (item.strFgExtranjero == 1) {
                                        dicTecnico["lugar"] =  item.strPais;
                                    } else {
                                        dicTecnico["lugar"] = (item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito);
                                    }
                                    listaTecnico.push(dicTecnico);
                                    //--
                                    break;
                                case 3:
                                    //universitario
                                    itemcountUni += 1;
                                    //--
                                    var dicUniversitario = {
                                        instEducativa:  item.strNombreCentro,
                                        facultad:  item.strNombreEstudio,
                                        carrera:  item.strNombreCarrera,
                                        concluido: (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido'),
                                        periodo: (item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                        tipoGrado: item.strTipoGrado,
                                    }
                                    if (item.strFgExtranjero == 1) {
                                        dicUniversitario["lugar"] =  item.strPais;
                                    } else {
                                        dicUniversitario["lugar"] = (item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito);
                                    }
                                    listaUniversitario.push(dicUniversitario);
                                    //--
                                    break;
                                case 4:
                                    //postgrado
                                    itemcountPos += 1;
                                    //--
                                    var dicPostgrado = {
                                        instEducativa: item.strNombreCentro,
                                        Especialidad:  item.strNombreEstudio,
                                        concluido: (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido'),
                                        periodo: (item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                        tipoGrado: item.strTipoGrado 
                                    }

                                    if (item.intTipoPostgrado == 1) {
                                        dicPostgrado["tipo"] = "Maestria";
                                    } else if (item.intTipoPostgrado == 2) {
                                        dicPostgrado["tipo"] = "Doctorado";
                                    } else if (item.intTipoPostgrado == 3) {
                                        dicPostgrado["tipo"] = item.strOtroTipoDocumento;
                                    }
                                    if (item.strFgExtranjero == 1) {
                                        dicPostgrado["lugar"] =  item.strPais;
                                    } else {
                                        dicPostgrado["lugar"] = (item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito);
                                    }
                                    listaPostgrado.push(dicPostgrado);
                                    //--
                                    break;
                                }

                            });
                            dicEducacion["tecnico"] = listaTecnico;
                            dicEducacion["universitario"] = listaUniversitario;
                            dicEducacion["postgrado"] = listaPostgrado;

                            if (itemcountTec < 1) {
                                dicEducacion["tecnico"] = null;}
                            if (itemcountUni < 1) {
                                dicEducacion["universitario"] = null;}
                            if (itemcountPos < 1) {
                                dicEducacion["postgrado"] = null;}
                        }

                    },
                    error: function (xhr, status, error) {
                        dicEducacion["tecnico"] = "error";
                        dicEducacion["universitario"] = "error";
                        dicEducacion["postgrado"] = "error";
                    }
                });

                var boolEducacion = dicEducacion.primaria || dicEducacion.secundaria || dicEducacion.tecnico || dicEducacion.universitario || dicEducacion.postgrado;
                if(boolEducacion)
                {imprimeDato("educacion",dicEducacion);}
                else {imprimeDato("educacion", null);}
                  
                //--


                //Cargos politicos
                var dicPolitico = {}

                /* candidato cargos partidarios */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CargoPartidarioListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {

                        var listaCargosPartidarios = [];

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                dicCargosPartidarios = {
                                    orgPolitica:  item.strOrganizacionPolitica,
                                    ambito:  item.objAmbitoBE.strAmbito,
                                    cargo: item.strNombre_Cargo,
                                    periodo: (item.intAnio_Inicio + ' - ' + (item.intAnio_Final == 0 ? strMsgHastaActualidad : item.intAnio_Final)),
                                };

                                listaCargosPartidarios.push(dicCargosPartidarios);
                            });
                        }
                        if (jsondata.d.length == 0) {dicPolitico["partidario"] = null;}
                        else{dicPolitico["partidario"] = listaCargosPartidarios;}
                    },
                    error: function (xhr, status, error) {
                        dicPolitico["partidario"] = "error";
                    }
                });

                /* candidato cargo de eleccion popular */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CargoEleccionListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {

                        var listaCargoEleccion = [];

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var _dep = "";
                                var _pro = "";
                                var _dis = "";
                                var _pob = "";

                                if (item.objUbigeoCargoPopularBE.strDepartamento != "") { _dep = item.objUbigeoCargoPopularBE.strDepartamento }
                                if (item.objUbigeoCargoPopularBE.strProvincia != "") { _pro = " - " + item.objUbigeoCargoPopularBE.strProvincia }
                                if (item.objUbigeoCargoPopularBE.strDistrito != "") { _dis = " - " + item.objUbigeoCargoPopularBE.strDistrito }
                                if (item.strCentroPoblado != "") { _pob = " - " + item.strCentroPoblado }

                                var dicCargoEleccion ={
                                    orgPolitica: item.strOrganizacionPolitica,
                                    ambito: item.objAmbitoBE.strAmbito,
                                    lugar: (_dep + _pro + _dis + _pob),
                                    procesoElectoral: item.strProcesoElectoral,
                                    periodo: (item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                };

                                if (item.objAmbitoBE.intIdAmbito == 6) {
                                    dicCargoEleccion["cargo"] = item.strOtroCargo;
                                } else {
                                    dicCargoEleccion["cargo"] =item.objCargoAutoridadBE.strCargoAutoridad;
                                }
                                listaCargoEleccion.push(dicCargoEleccion);

                            });
                            
                        }
                        if (jsondata.d.length == 0) {dicPolitico["eleccion"] = null;}
                        else{dicPolitico["eleccion"] = listaCargoEleccion;}


                    },
                    error: function (xhr, status, error) {
                        dicPolitico["eleccion"] = "error";
                    }
                });

                /* candidato militancia partidaria */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/RenunciasOPListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {
                        var listaRenuncias = [];
                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var dicRenuncias ={
                                    //Denominación de la O.P. a la que renunció o cuya inscripción fue cancelada
                                    orgPolitica:  item.strOrgPolitica,
                                    periodo: ( item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                };
                                listaRenuncias.push(dicRenuncias);
                            });
                        }
                        if (jsondata.d.length == 0) { dicPolitico["militancia"] = null;}
                        else{ dicPolitico["militancia"] = listaRenuncias;}
                    }, 
                    error: function (xhr, status, error) {
                        dicPolitico["militancia"] = "error";
                    },
                });

                if(dicPolitico["partidario"] || dicPolitico["eleccion"] || dicPolitico["militancia"])
                {imprimeDato("cargosPoliticos", dicPolitico);}
                else{ imprimeDato("cargosPoliticos", null);}
                //--

                //Sentencias
                var dicSentencias = {};

                /* candidato condenas impuestas */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/AmbitoPenalListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {
                        if (jsondata.d) {
                            var listaPenal = [];
                            $.each(jsondata.d, function (i, item) {
                                var dicPenal = {
                                    //Número de expediente
                                    expediente: item.strExpediente,
                                    //Fecha de sentencia firme
                                    fechaSentencia: (item.strFecha_Sentencia.substring(0, 2) + '/' + item.strFecha_Sentencia.substring(2, 4) + '/' + item.strFecha_Sentencia.substring(4, 8)),
                                    juzgado: item.strJuzagado,
                                    delito: item.strAcusacion_Penal,
                                    fallo: item.strFallo,
                                };
                                listaPenal.push(dicPenal);
                            });
                            if (jsondata.d.length == 0) {dicSentencias["penal"] = null;}
                            else{dicSentencias["penal"] = listaPenal;}
                        }
                    }, 
                    error: function (xhr, status, error) {
                        dicSentencias["penal"] = "error";
                    }
                });

                /* candidato condenas fundadas*/
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/AmbitoCivilListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async:false,
                    success: function (jsondata) {
                        var listaCivil = [];
                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var dicCivil = {
                                    materia: item.objTipoMateriaBE.strMateria,
                                    //Número de expediente
                                    expediente: item.strExpediente,
                                    juzgado:  item.strJuzgado,
                                    //Materia de la demanda
                                    materia: item.strMateria,
                                    fallo: item.strFallo,
                                };

                                listaCivil.push(dicCivil);
                            });
                        }

                        if (jsondata.d.length == 0) { dicSentencias["civil"] = null;
                        }
                        else{ dicSentencias["civil"] = listaCivil;}


                    }, 
                    error: function (xhr, status, error) {
                        dicSentencias["civil"] = "error";
                    },
                });

                if(dicSentencias["civil"] || dicSentencias["Penal"])
                {imprimeDato("sentencias",dicSentencias);}
                else {imprimeDato("sentencias", null);}
                //--

                /* candidato otra experiencia */
                if (objCandidato.strExperienciaOtra == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoAdicionalListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (jsondata) {

                            if (jsondata.d) {
                                
                                var listaOtraExperiencia = [];

                                $.each(jsondata.d, function (i, item) {
                                    
                                    var dicOtraExperiencia = {
                                        cargo: item.strCargo,
                                        entidad: item.strInstitucion,
                                        periodo: (item.intAnio_Inicio + ' - ' + (item.intAnio_Final == 0 ? strMsgHastaActualidad : item.intAnio_Final)),
                                    };

                                    listaOtraExperiencia.push(dicOtraExperiencia);
                                });
                                imprimeDato("otraExperiencia",listaOtraExperiencia);
                            }

                        },
                        error: function (xhr, status, error) {
                            imprimeDato("otraExperiencia", "error");
                        },
                    });
                } else if (objCandidato.strExperienciaOtra == '0' || objCandidato.strExperienciaOtra == '') {
                    imprimeDato("otraExperiencia",null);
                }

                /* candidato ingresos */
                if (objCandidato.strIngresos == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/IngresoListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (jsondata) {

                            if (jsondata.d) {
                                objCandidatoIngresosBE = jsondata.d;

                                var dicIngresos = {
                                    //REMUNERACIÓN BRUTA MENSUAL S/.
                                    remuneracion: {
                                        publico: formatNumber(jsondata.d.floRemuneracionPublico, 2),
                                        privado: formatNumber(jsondata.d.floRemuneracionPrivado, 2),
                                        total:   formatNumber(jsondata.d.floRemuneracionTotal, 2),
                                    },
                                    //RENTA BRUTA MENSUAL POR EJERCICIO INDIVIDUAL S/.
                                    renta: {
                                        publico: formatNumber(jsondata.d.floRentaPublico, 2),
                                        privado: formatNumber(jsondata.d.floRentaPrivado, 2),
                                        total:   formatNumber(jsondata.d.floRentaTotal, 2),
                                    },
                                    //OTROS INGRESOS MENSUALES S/.
                                    otros: {
                                        publico: formatNumber(jsondata.d.floOtrosPublico, 2),
                                        privado: formatNumber(jsondata.d.floOtrosPrivado, 2),
                                        total:   formatNumber(jsondata.d.floOtrosTotal, 2),
                                    },
                                    //Total S/.
                                    total: formatNumber((jsondata.d.floRemuneracionTotal * 1) + (jsondata.d.floRentaTotal * 1) + (jsondata.d.floOtrosTotal * 1), 2),
                                };
                                imprimeDato("ingresos",dicIngresos);

                            }

                        }, 
                        error: function (xhr, status, error) {
                            imprimeDato("ingresos","error");
                        },
                    });


                    /* candidato bienes inmuebles - muebles */
                    if (objCandidato.strInmuebles == '1' || objCandidato.strMuebles == '1') {
                        $.ajax({
                            url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/BienesListarPorCandidato",
                            data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (jsondata) {

                                if (jsondata.d) {

                                    var dicBienes = {
                                        muebles: null,
                                        inmuebles: null,
                                    };

                                    var listaMuebles = [];
                                    var listaInmuebles = [];

                                    $.each(jsondata.d, function (i, item) {
                                        switch (item.intId_Bien) {
                                        case 1:
                                            //inmuebles
                                            var dicInmuebles = {
                                                //Tipo de bien
                                                tipo: item.strNombre_Bien,
                                                direccion: item.strDescripcion_Bien,
                                                //N° Ficha - Reg. público
                                                registro: item.strCaracteristicas_Bien,
                                                //Valor autovaluo S/.
                                                valor: formatNumber(item.floValor_Bien, 2),
                                            };

                                            listaInmuebles.push(dicInmuebles);
                                            break;
                                        case 2:
                                        case 3:
                                            //muebles (vehiculo - otros)

                                            var dicMuebles ={
                                                //Tipo de bien
                                                tipo: item.strNombre_Bien,
                                                //Descripción / Marca-Modelo-Año
                                                descripcion: item.strDescripcion_Bien,
                                                //Placa / Caracteristicas
                                                caracteristicas: item.strCaracteristicas_Bien,
                                                //Valor S/.
                                                valor: formatNumber(item.floValor_Bien, 2),
                                            };

                                            if (item.intId_Bien == 2) {
                                                dicMuebles["bien"] = "Vehiculo";
                                            } else if (item.intId_Bien == 3) {
                                                dicMuebles["bien"] = "Otro";
                                            }
                                            listaMuebles.push(dicMuebles);
                                            break;
                                        }

                                    });
                                    
                                    if (listaMuebles.length){dicBienes.muebles = listaMuebles;}
                                    if (listaInmuebles.length){dicBienes.inmuebles = listaInmuebles;}

                                    if(listaMuebles.length || listaInmuebles.length){imprimeDato("bienes", dicBienes);}
                                    else{imprimeDato("bienes", null);}

                                }

                            },
                        });
                    }

                    /* candidato acreencias - obligaciones */
                    if (objCandidato.strEgresos == '1') {
                        $.ajax({
                            url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EgresosListarPorCandidato",
                            data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (jsondata) {

                                if (jsondata.d) {

                                    var listaAcreencias = [];

                                    $.each(jsondata.d, function (i, item) {

                                        var dicAcreencias = {
                                            //Detalle de la acreencia
                                            detalle: item.strDetalleAcreencia,
                                            //Monto S/.
                                            monto: formatNumber(item.floTotalDeuda, 2),
                                        };

                                        listaAcreencias.push(dicAcreencias);

                                    });
                                    imprimeDato("acreencias", listaAcreencias);
                                }

                            }, 
                            error: function (xhr, status, error) {
                                imprimeDato("acreencias", "error")
                            },
                        });
                    } else if (objCandidato.strEgresos == '0' || objCandidato.strEgresos == '') {
                        imprimeDato("acreencias", null);
                    }
                    //

                    /* anotacion marginal */

                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/simulador.asmx/Soporte_CandidatoAnotMarginal",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (jsondata) {

                            var itemAnotacion = 0;

                            if (jsondata.d) {
                                var listaAnotaciones = [];
                                $.each(jsondata.d, function (i, item) {
                                    itemAnotacion += 1;
                                    var dicAnotaciones = {
                                        referencia: item.strReferencia,
                                        //Anotación Marginal
                                        anotacion: item.strObservacionCompleto,
                                    };

                                    listaAnotaciones.push(dicAnotaciones);
                                });
                                imprimeDato("observaciones", listaAnotaciones);
                            }

                            if (itemAnotacion == 0) { imprimeDato("observaciones", null) }

                        }, error: function (xhr, status, error) {
                            imprimeDato("observaciones", "error")
                        }
                    });


                }
                else{
                    imprimeDato("ingresos", null);
                }
            }

        }});

           return lista_datos;
          };
    //End scrap function
