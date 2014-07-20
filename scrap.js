
var scrap = function scrap (idCandidato, idProceso, idOrgPolitica) {

    //creacion de objeto candidato
    var objCandidatoBE = new Object();
    objCandidatoBE.objProcesoElectoralBE = new Object();
    objCandidatoBE.objOpInscritasBE = new Object();
    objCandidatoBE.objAmbitoBE = new Object();
    objCandidatoBE.objCargoAutoridadBE = new Object();
    objCandidatoBE.objUbigeoPostulaBE = new Object();
    objCandidatoBE.objUbigeoNacimientoBE = new Object();
    objCandidatoBE.objUbigeoResidenciaBE = new Object();
    objCandidatoBE.objUsuarioBE = new Object();

    var strMsgHastaActualidad = 'Hasta la actualidad';


    var lista_datos = {};

    var imprimeDato = function imprime_dato(tipo,cadena)
    {
        lista_datos[tipo] = cadena;
    };

    idCandidato = idCandidato.toString();
    idProceso = idProceso.toString();
    idOrgPolitica = idOrgPolitica.toString();

    var objPerfilUsuarioBEnew = new Object();

    //candidato
    objCandidatoBE.objOpInscritasBE.intCod_OP = idOrgPolitica;
    objCandidatoBE.objProcesoElectoralBE.intIdProceso = idProceso;
    objCandidatoBE.intId_Candidato = idCandidato;

    var objOPInscritasBE = new Object();
    objOPInscritasBE.objProcesoElectoralBE = new Object();
    objOPInscritasBE.intCod_OP = idOrgPolitica;
    objOPInscritasBE.objProcesoElectoralBE.intIdProceso = idProceso;

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
                var str = '';

                var objCandidato = new Object();
                objCandidato = jsondata.d;

                // Datos principales
                imprimeDato("txNroRegistro",objCandidato.strRegistro_Org_Pol)
                imprimeDato("txtCargoPostula",objCandidato.objCargoAutoridadBE.strCargoAutoridad)
                imprimeDato("txtLugarPostula",objCandidato.objUbigeoPostulaBE.strDepartamento + ' - ' + objCandidato.objUbigeoPostulaBE.strProvincia + ' - ' + objCandidato.objUbigeoPostulaBE.strDistrito)
                imprimeDato("txtFormaDesignacion",objCandidato.strFormaDesignacion)
                imprimeDato("txtDNI",objCandidato.strDNI)
                imprimeDato("txtApellidoPaterno",objCandidato.strAPaterno.toUpperCase())
                imprimeDato("txtApellidoMaterno",objCandidato.strAMaterno.toUpperCase())
                imprimeDato("txtNombres",objCandidato.strNombres.toUpperCase())
                imprimeDato("txtFechaNacimiento",objCandidato.strFecha_Nac.substring(6, 8) + '/' + objCandidato.strFecha_Nac.substring(4, 6) + '/' + objCandidato.strFecha_Nac.substring(0, 4))
                if (objCandidato.intId_Sexo == 1) {
                    imprimeDato("txtSexo",'Masculino')
                } else {
                    imprimeDato("txtSexo",'Femenino')
                }
                imprimeDato("txtCorreoElectronico",objCandidato.strCorreo)

                //nacimiento
                imprimeDato("txtPais",objCandidato.strPais)
                imprimeDato("txtDepartamentoNac",objCandidato.objUbigeoNacimientoBE.strDepartamento)
                imprimeDato("txtProvinciaNac",objCandidato.objUbigeoNacimientoBE.strProvincia)
                imprimeDato("txtDistritoNac",objCandidato.objUbigeoNacimientoBE.strDistrito)

                //residencia
                imprimeDato("txtLugarResicencia",objCandidato.strResidencia)
                imprimeDato("txtLugarDepartamentoRes",objCandidato.objUbigeoResidenciaBE.strDepartamento)
                imprimeDato("txtLugarProvinciaRes",objCandidato.objUbigeoResidenciaBE.strProvincia)
                imprimeDato("txtLugarDistritoRes",objCandidato.objUbigeoResidenciaBE.strDistrito)
                imprimeDato("txtTiempoRes",objCandidato.strTiempo_Residencia + ' años')
                                               
                if (objCandidato.strInmuebles == 0 || objCandidato.strInmuebles == '') { imprimeDato("lblInmuebles",'No registró información.') }
                if (objCandidato.strMuebles == 0 || objCandidato.strMuebles == '') { imprimeDato("lblMuebles",'No registró información.') }

                
                /* candidato familia */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoFamiliaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {
                        if (jsondata.d) {

                            $.each(jsondata.d, function (i, item) {
                                switch (item.objTipoBE.intTipo) {
                                case 1:
                                    imprimeDato("txtPadre",item.strNombres.toUpperCase())
                                    break;
                                case 2:
                                    imprimeDato("txtMadre",item.strNombres.toUpperCase())
                                    break;
                                case 3:
                                    imprimeDato("txtConyuge",item.strNombres.toUpperCase())
                                    break;
                                }
                            });
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
                    success: function (jsondata) {

                        if (jsondata.d.length < 1){
                            imprimeDato("lblExperiencia",'No cuenta con experiencia laboral.');
                        }

                        if (jsondata.d) {
                            
                            var listaExperiencia = [];
                            $.each(jsondata.d, function (i, item) {
                                

                                var str = '';
                                var dep = item.objUbigeoExperiencia.strUbigeo.substring(0, 2);
                                var pro = item.objUbigeoExperiencia.strUbigeo.substring(2, 4);
                                var dis = item.objUbigeoExperiencia.strUbigeo.substring(4, 6);
                                
                                var dic_laboral = {
                                    empleador:  item.strEmpleador,
                                    sector: item.objTipoSectorBE.strNombre_Sector,
                                    cargo:  item.strCargo,
                                    iniciaAnio: item.intInicioAnio,
                                    finAnio: (item.intFinAnio == 0 ? strMsgHastaActualidad : item.intFinAnio),
                                    ubicacion: (item.objUbigeoExperiencia.strDepartamento + ' - ' + item.objUbigeoExperiencia.strProvincia + ' - ' + item.objUbigeoExperiencia.strDistrito )
                                };

                                listaExperiencia.push(dic_laboral);
                                

                            });
                            imprimeDato("lblExperiencia",listaExperiencia);
                        }
                        
                    }, error: function (xhr, status, error) {
                        imprimeDato("lblExperiencia",'No se pudo obtener la información, vuelva a  intentar.');
                    }
                });


                /* candidato educacion basica */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EducacionBasicaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {

                        if (jsondata.d) {

                            var itemcountPri = 0;
                            var itemcountSec = 0;
                            //--
                            var lista_primaria = [];
                            var lista_secundaria = [];
                            //--

                            $.each(jsondata.d, function (i, item) {

                                var str = '';

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
                                        dicPrimaria["lugar"] = item.strPais
                                    } else {
                                        dicPrimaria["lugar"] = (item.objUbigeoPrimaria.strDepartamento + ' - ' + 
                                                                item.objUbigeoPrimaria.strProvincia + ' - ' + 
                                                                item.objUbigeoPrimaria.strDistrito);                                        
                                    }
                                    itemcountPri+=1;
                                    lista_primaria.push(dicPrimaria);
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
                                    lista_secundaria.push(dicSecundaria) ;
                                    //--
                                    break;

                                }

                            });

                            if (itemcountPri < 1) { imprimeDato("lblEducacionPrimaria",'No cuenta con educación primaria.') }
                            else { imprimeDato("lblEducacionPrimaria", lista_primaria )}
                            if (itemcountSec < 1) { imprimeDato("lblEducacionSecundaria",'No cuenta con educacion secundaria.') }
                            else { imprimeDato("lblEducacionSecundaria", lista_secundaria)}
                            

                        }

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblEducacionPrimaria",'No se pudo obtener la información, vuelva a  intentar.')
                        imprimeDato("lblEducacionSecundaria",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });


                /* candidato educacion superior */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EducacionSuperiorListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
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
                            imprimeDato("lblEducacionTecnico",listaTecnico);
                            imprimeDato("lblEducacionUniversitario",listaUniversitario);
                            imprimeDato("lblEducacionPostgrado",listaPostgrado);
                            if (itemcountTec < 1) { imprimeDato("lblEducacionTecnico",'No cuenta con educación técnica.') }
                            if (itemcountUni < 1) { imprimeDato("lblEducacionUniversitario",'No cuenta con educación universitaria.') }
                            if (itemcountPos < 1) { imprimeDato("lblEducacionPostgrado",'No cuenta con educación en postgrado.') }
                        }

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblEducacionTecnico",'No se pudo obtener la información, vuelva a  intentar.')
                        imprimeDato("lblEducacionUniversitario",'No se pudo obtener la información, vuelva a  intentar.')
                        imprimeDato("lblEducacionPostgrado",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });

                /* candidato cargos partidarios */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CargoPartidarioListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {
                        if (jsondata.d) {
                            
                            var listaCargosParidarios = [];

                            $.each(jsondata.d, function (i, item) {
                                dicCargosPartidarios = {
                                    orgPolitica:  item.strOrganizacionPolitica,
                                    ambito:  item.objAmbitoBE.strAmbito,
                                    cargo: item.strNombre_Cargo,
                                    periodo: (item.intAnio_Inicio + ' - ' + (item.intAnio_Final == 0 ? strMsgHastaActualidad : item.intAnio_Final)),
                                };

                                listaCargosParidarios.push(dicCargosPartidarios);
                            });
                        }
                        if (jsondata.d.length == 0) {
                            imprimeDato("lblCargosPartidarios",'No cuenta con cargos partidarios.')
                        }
                        else{
                            imprimeDato("lblCargosPartidarios", listaCargosParidarios)}

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblCargosPartidarios",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });


                /* candidato cargo de eleccion popular */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CargoEleccionListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {

                        if (jsondata.d) {
                            
                            var listaCargoEleccion = [];

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
                            if (jsondata.d.length == 0) {
                                imprimeDato("lblCargosEleccion",'No cuenta con cargos de elección popular.');}
                            else{
                            imprimeDato("lblCargosEleccion",listaCargoEleccion);}
                        }

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblCargosEleccion",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });

                /* candidato militancia partidaria */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/RenunciasOPListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {
                        if (jsondata.d) {

                            var listaRenuncias = [];

                            $.each(jsondata.d, function (i, item) {
                                
                                var dicRenuncias ={
                                    //Denominación de la O.P. a la que renunció o cuya inscripción fue cancelada
                                    orgPolitica:  item.strOrgPolitica,
                                    periodo: ( item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal)),
                                };

                                listaRenuncias.push(dicRenuncias);
                            });
                        }
                        if (jsondata.d.length == 0) {
                            imprimeDato("lblMilitancia",'No cuenta con militancia en otros partidos.');
                        }
                        else{
                        imprimeDato("lblMilitancia",listaRenuncias);}
                    }, error: function (xhr, status, error) {
                        imprimeDato("lblMilitancia",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });


                /* candidato condenas impuestas */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/AmbitoPenalListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
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

                            if (jsondata.d.length == 0) {
                                imprimeDato("lblAmbitoPenal",'No cuenta con antecedentes penales.');
                            }
                            else{
                            imprimeDato("lblAmbitoPenal", listaPenal);}
                        }

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblAmbitoPenal",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });

                /* candidato condenas fundadas*/
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/AmbitoCivilListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
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

                        if (jsondata.d.length == 0) {
                            imprimeDato("lblAmbitoCivil",'No cuenta con antecedentes civiles.');
                        }
                        else{
                        imprimeDato("lblAmbitoCivil", listaCivil);}


                    }, error: function (xhr, status, error) {
                        imprimeDato("lblAmbitoCivil",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });


                /* candidato otra experiencia */
                if (objCandidato.strExperienciaOtra == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoAdicionalListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
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
                                imprimeDato("lblOtraExperiencia",listaOtraExperiencia);
                            }

                        }, error: function (xhr, status, error) {
                            imprimeDato("lblOtraExperiencia",'No se pudo obtener la información, vuelva a  intentar.')
                        }
                    });
                } else if (objCandidato.strExperienciaOtra == '0' || objCandidato.strExperienciaOtra == '') {
                    imprimeDato("lblOtraExperiencia",'No registró información.')
                }

                /* candidato ingresos */
                if (objCandidato.strIngresos == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/IngresoListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        success: function (jsondata) {

                            if (jsondata.d) {
                                objCandidatoIngresosBE = jsondata.d;
                                imprimeDato("txtIngresoRemuneracionPublica",formatNumber(objCandidatoIngresosBE.floRemuneracionPublico, 2))
                                imprimeDato("txtIngresoRemuneracionPrivada",formatNumber(objCandidatoIngresosBE.floRemuneracionPrivado, 2))
                                imprimeDato("txtIngresoRemuneracionTotal",formatNumber(objCandidatoIngresosBE.floRemuneracionTotal, 2))
                                imprimeDato("txtIngresoRentaPublica",formatNumber(objCandidatoIngresosBE.floRentaPublico, 2))
                                imprimeDato("txtIngresoRentaPrivada",formatNumber(objCandidatoIngresosBE.floRentaPrivado, 2))
                                imprimeDato("txtIngresoRentaTotal",formatNumber(objCandidatoIngresosBE.floRentaTotal, 2))
                                imprimeDato("txtIngresoOtrosPublico",formatNumber(objCandidatoIngresosBE.floOtrosPublico, 2))
                                imprimeDato("txtIngresoOtrosPrivado",formatNumber(objCandidatoIngresosBE.floOtrosPrivado, 2))
                                imprimeDato("txtIngresoOtrosTotal",formatNumber(objCandidatoIngresosBE.floOtrosTotal, 2))
                                imprimeDato("txtCandidatoIngresoTotal",formatNumber((objCandidatoIngresosBE.floRemuneracionTotal * 1) + (objCandidatoIngresosBE.floRentaTotal * 1) + (objCandidatoIngresosBE.floOtrosTotal * 1), 2))

                                if (objCandidatoIngresosBE.floRemuneracionPublico >= 0 || objCandidatoIngresosBE.floRemuneracionPrivado >= 0 || objCandidatoIngresosBE.floRentaPublico >= 0 || objCandidatoIngresosBE.floRentaPrivado >= 0 || objCandidatoIngresosBE.floOtrosPublico >= 0 || objCandidatoIngresosBE.floOtrosPrivado >= 0) {
                                    imprimeDato("lblIngresos", "Hay informacion disponible")
                                } else {
                                    imprimeDato("lblIngresos",'No registró información.')
                                }

                            }

                        }, error: function (xhr, status, error) {
                            imprimeDato("lblIngresos",'No se pudo obtener la información, vuelva a  intentar.')
                        }
                    });
                } else if (objCandidato.strIngresos == '0' || objCandidato.strIngresos == '') {

                }

                /* candidato bienes inmuebles - muebles */
                if (objCandidato.strInmuebles == '1' || objCandidato.strMuebles == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/BienesListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        success: function (jsondata) {

                            if (jsondata.d) {
                                $.each(jsondata.d, function (i, item) {
                                    var str = '';

                                    switch (item.intId_Bien) {
                                    case 1:

                                        //inmuebles
                                        str += '<tr>';
                                        str += '<th>Tipo de bien</th>';
                                        str += '<td>' + item.strNombre_Bien + '</td>';
                                        str += '<th>Dirección</th>';
                                        str += '<td>' + item.strDescripcion_Bien + '</td>';
                                        str += '</tr>';

                                        str += '<tr>';
                                        str += '<th>N° Ficha - Reg. público</th>';
                                        str += '<td>' + item.strCaracteristicas_Bien + '</td>';
                                        str += '<th>Valor autovaluo S/.</th>';
                                        str += '<td>' + formatNumber(item.floValor_Bien, 2) + '</td>';
                                        str += '</tr>';

                                        str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                        $('#tblCandidatoInmueble').append(str);
                                        $('#tblCandidatoInmueble').show();

                                        break;
                                    case 2:
                                    case 3:
                                        //muebles (vehiculo - otros)
                                        str += '<tr>';
                                        str += '<th>Bien</th>';
                                        if (item.intId_Bien == 2) {
                                            str += '<td colspan="3">Vehiculo</td>';
                                        } else if (item.intId_Bien == 3) {

                                            str += '<td colspan="3">Otro</td>';
                                        }
                                        str += '</tr>';

                                        str += '<tr>';
                                        str += '<th>Tipo de bien</th>';
                                        str += '<td>' + item.strNombre_Bien + '</td>';
                                        str += '<th>Descripción / Marca-Modelo-Año</th>';
                                        str += '<td>' + item.strDescripcion_Bien + '</td>';
                                        str += '</tr>';

                                        str += '<tr>';
                                        str += '<th>Placa / Caracteristicas</th>';
                                        str += '<td>' + item.strCaracteristicas_Bien + '</td>';
                                        str += '<th>Valor S/.</th>';
                                        str += '<td>' + formatNumber(item.floValor_Bien, 2) + '</td>';
                                        str += '</tr>';

                                        str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                        $('#tblCandidatoMueble').append(str);
                                        $('#tblCandidatoMueble').show();

                                        break;
                                    }

                                });
                            }

                        }, error: function (xhr, status, error) {
                            $("#divAlert").dialog('open');
                            $("#spnAlert").empty().html(xhr.responseText);
                        }
                    });
                }
                //


                /* candidato acreencias - obligaciones */
                if (objCandidato.strEgresos == '1') {
                    $.ajax({
                        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/EgresosListarPorCandidato",
                        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        success: function (jsondata) {

                            if (jsondata.d.length == 0) {
                                $('#tblEgreso').parent().parent().parent().parent().removeClass('tblVacio');
                            }

                            if (jsondata.d) {
                                $.each(jsondata.d, function (i, item) {

                                    var str = '';

                                    str += '<tr>';
                                    str += '<th>Detalle de la acreencia</th>';
                                    str += '<td>' + item.strDetalleAcreencia + '</td>';
                                    str += '<th>Monto S/.</th>';
                                    str += '<td>' + formatNumber(item.floTotalDeuda, 2) + '</td>';
                                    str += '</tr>';

                                    str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                    $('#tblEgreso').append(str);
                                    $('#tblEgreso').show();

                                });
                            }

                        }, error: function (xhr, status, error) {
                            imprimeDato("lblAcreencias",'No se pudo obtener la información, vuelva a  intentar.')
                        }
                    });
                } else if (objCandidato.strEgresos == '0' || objCandidato.strEgresos == '') {
                    imprimeDato("lblAcreencias",'No registró información.')
                }
                //

                /* anotacion narginal */

                var itemAnotacion = 0;

                objCandidatoBE.intEstado = 1;

                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/simulador.asmx/Soporte_CandidatoAnotMarginal",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {

                                itemAnotacion += 1;

                                var str = '';

                                str += '<tr>';
                                str += '<th>Referencia</th>';
                                str += '<td>' + item.strReferencia + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Anotación Marginal</th>';
                                str += '<td>' + item.strObservacionCompleto + '</td>';
                                str += '</tr>';

                                str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                $('#tblObservaciones').append(str);
                                $('#tblObservaciones').show();

                            });
                        }

                        if (itemAnotacion == 0) { imprimeDato("lblAnotaciones",'No cuenta con observaciones') }

                    }, error: function (xhr, status, error) {
                        imprimeDato("lblAnotaciones",'No se pudo obtener la información, vuelva a  intentar.')
                    }
                });


            }
        },
        error: function (xhr, status, error) {
            $("#divAlert").dialog('open');
            $("#spnAlert").empty().html(xhr.responseText);
        }
    });

/*
    var all_done=0;

    while(! all_done){
    $(document).ajaxStop(
        function done(){all_done=1;});
    }
*/
    return lista_datos;
};
// end document ready

String.prototype.right = function (n) {
    return this.substr((this.length - n), this.length);
};



function formatNumber(number, decimal) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(decimal);
}
