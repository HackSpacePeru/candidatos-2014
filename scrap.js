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





// document ready
var scrap = function scrap (idCandidato, idProceso, idOrgPolitica) {
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

    $.ajax({
        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/OP_ObtenerNombrePorID",
        data: '{"objOPInscritasBE":' + JSON.stringify(objOPInscritasBE) + '}',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (jsondata) {
            $("#txtOrganizacionPolitica").html(jsondata.d.strDES_OP);
        }
    });

    $.ajax({
        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoListarPorID",
        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (jsondata) {
            if (jsondata.d) {
                var str = '';

                var objCandidato = new Object();
                objCandidato = jsondata.d;

                //Foto
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoFotoListarPorID",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (jsondata) {
                        if (jsondata.d) {

                            var objCandidatoFoto = new Object();
                            objCandidatoFoto = jsondata.d;

                            if (objCandidatoFoto.strArchivo != '' && objCandidatoFoto.strArchivo != null) {
                                imprimeDato("imgFoto",'')
                                intFotoEncontrada = 1;
                                if (objCandidatoFoto.strFotoPadron == '0') {
                                    $('#fotoCandidato').attr('src', '../06FOTOS/2014/' + objCandidatoFoto.strArchivo);
                                } else {
                                    MostrarFotoDNI(objCandidato.strDNI, false);
                                }
                            }

                        }
                    }, error: function (xhr, status, error) {

                    }
                });

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

                if (objCandidato.strExperiencia == 0) { imprimeDato("lblExperiencia",'No cuenta con experiencia laboral.') }
                if (objCandidato.strEducacionPrimaria == 0) { imprimeDato("lblEducacionPrimaria",'No cuenta con educación primaria.') }
                if (objCandidato.strEducacionSecundaria == 0) { imprimeDato("lblEducacionSecundaria",'No cuenta con educacion secundaria.') }
                if (objCandidato.strEducacionTecnico == 0) { imprimeDato("lblEducacionTecnico",'No cuenta con educación técnica.') }
                if (objCandidato.strEducacionUniversitario == 0) { imprimeDato("lblEducacionUniversitario",'No cuenta con educación universitaria.') }
                if (objCandidato.strEducacionPostgrado == 0) { imprimeDato("lblEducacionPostgrado",'No cuenta con educación en postgrado.') }
                if (objCandidato.strCargo_Partidario == 0) { imprimeDato("lblCargosPartidarios",'No cuenta con cargos partidarios.') }
                if (objCandidato.strCargo_Eleccion == 0) { imprimeDato("lblCargosEleccion",'No cuenta con cargos de elección popular.') }
                if (objCandidato.strVinculo_ROP == 0) { imprimeDato("lblMilitancia",'No cuenta con militancia en otros partidos.') }
                if (objCandidato.strAntecedente_Penal == 0) { imprimeDato("lblAmbitoPenal",'No cuenta con antecedentes penales.') }
                if (objCandidato.strAntecedente_Civil == 0) { imprimeDato("lblAmbitoCivil",'No cuenta con antecedentes civiles.') }
                if (objCandidato.strExperienciaOtra == 0) { imprimeDato("lblOtraExperiencia",'No registró información.') }

                if (objCandidato.strInmuebles == 0 || objCandidato.strInmuebles == '') { imprimeDato("lblInmuebles",'No registró información.') }
                if (objCandidato.strMuebles == 0 || objCandidato.strMuebles == '') { imprimeDato("lblMuebles",'No registró información.') }

                if (objCandidato.strEgresos == 0 || objCandidato.strEgresos == '') { imprimeDato("lblAcreencias",'No registró información.') }

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
                    }, error: function (xhr, status, error) {
                        $("#divAlert").dialog('open');
                        $("#spnAlert").empty().html(xhr.responseText);
                    }
                });


                /* candidato experiencia */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CandidatoExperienciaListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {

                        if (jsondata.d.length == 0) {
                            $('#tblExperiencia').parent().parent().parent().parent().removeClass('tblVacio');
                        }

                        if (jsondata.d.length >= 1) {

                        } else {
                            imprimeDato("lblExperiencia",'No cuenta con experiencia laboral.')
                        }

                        if (jsondata.d) {
                            var itemcount = 0;
                            var lista_tabla = [];
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

                                lista_tabla.push(dic_laboral);
                                

                            });
                            imprimeDato("lblExperiencia",lista_tabla);
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


                                    str += '<tr>';
                                    str += '<th style="width:20%" >Institución Educativa</th>';
                                    str += '<td style="width:30%">' + item.strCentroPrimaria + '</td>';
                                    str += '<th style="width:20%">Lugar</th>';
                                    if (item.strFgExtranjero == "1") {
                                        str += '<td style="width:30%">' + item.strPais + '</td>';
                                    } else {
                                        str += '<td style="width:30%">PERÚ - ' + item.objUbigeoPrimaria.strDepartamento + ' - ' + item.objUbigeoPrimaria.strProvincia + ' - ' + item.objUbigeoPrimaria.strDistrito + '</td>';
                                    }
                                    str += '</tr>';
                                    str += '<tr>';
                                    str += '<th>Concluido</th>';
                                    str += '<td>' + _concluidoPriText + '</td>';
                                    str += '<th>Período</th>';
                                    str += '<td>' + item.intAnioInicioPrimaria + ' - ' + (item.intAnioFinPrimaria == 0 ? strMsgHastaActualidad : item.intAnioFinPrimaria) + '</td>';

                                    itemcountPri += 1;


                                    if (jsondata.d.length > itemcountPri) {
                                        str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';
                                    }

                                    $('#tblEducacionPrimaria').show();
                                    $('#tblEducacionPrimaria').append(str);
                                    str = '';

                                    break;

                                case 2: //secundaria                                      

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

                                    str += '<tr>';
                                    str += '<th style="width:20%" >Institución Educativa</th>';
                                    str += '<td style="width:30%">' + item.strCentroSecundaria + '</td>';
                                    str += '<th style="width:20%">Lugar</th>';
                                    if (item.strFgExtranjero == "1") {
                                        str += '<td style="width:30%">' + item.strPais + '</td>';
                                    } else {
                                        str += '<td style="width:30%">PERÚ - ' + item.objUbigeoSecundaria.strDepartamento + ' - ' + item.objUbigeoSecundaria.strProvincia + ' - ' + item.objUbigeoSecundaria.strDistrito + '</td>';
                                    }
                                    str += '</tr>';
                                    str += '<tr>';
                                    str += '<th>Concluido</th>';
                                    str += '<td>' + _concluidoSecText + '</td>';
                                    str += '<th>Período</th>';
                                    str += '<td>' + item.intAnioInicioSecundaria + ' - ' + (item.intAnioFinSecundaria == 0 ? strMsgHastaActualidad : item.intAnioFinSecundaria) + '</td>';

                                    itemcountSec += 1;

                                    if (jsondata.d.length > itemcountSec) {
                                        str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';
                                    }

                                    $('#tblEducacionSecundaria').show();
                                    $('#tblEducacionSecundaria').append(str);
                                    str = '';
                                    break;

                                }

                            });

                            if (itemcountPri < 1) { imprimeDato("lblEducacionPrimaria",'No cuenta con educación primaria.') }
                            if (itemcountSec < 1) { imprimeDato("lblEducacionSecundaria",'No cuenta con educacion secundaria.') }


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


                            $.each(jsondata.d, function (i, item) {
                                var str = '';

                                var dep = item.objUbigeoBE.strUbigeo.substring(0, 2);
                                var pro = item.objUbigeoBE.strUbigeo.substring(2, 4);
                                var dis = item.objUbigeoBE.strUbigeo.substring(4, 6);

                                switch (item.objTipoEstudioBE.intTipo) {
                                case 1:
                                    //tecnico
                                    itemcountTec += 1;

                                    str += '<tr>';
                                    str += '<th>Nombre del centro de estudios</th>'
                                    str += '<td>' + item.strNombreCentro + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Lugar</th>'
                                    if (item.strFgExtranjero == 1) {
                                        str += '<td>' + item.strPais + '</td>';
                                    } else {
                                        str += '<td>' + item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito + '</td>';
                                    }
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Especialidad</th>'
                                    str += '<td>' + item.strNombreEstudio + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Curso</th>'
                                    str += '<td>' + item.strNombreCarrera + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Estado</th>'
                                    str += '<td>' + (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido') + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Periodo</th>'
                                    str += '<td>' + item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal) + '</td>'
                                    str += '</tr>';
                                    str += '<tr><td colspan="2" class="separatorItem">&nbsp;</td></tr>';

                                    $('#tblTecnico').append(str);
                                    $('#tblTecnico').show();

                                    break;
                                case 3:
                                    //universitario
                                    itemcountUni += 1;
                                    str += '<tr>';
                                    str += '<th>Nombre de la universidad</th>'
                                    str += '<td>' + item.strNombreCentro + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Lugar</th>'
                                    if (item.strFgExtranjero == 1) {
                                        str += '<td>' + item.strPais + '</td>';
                                    } else {
                                        str += '<td>' + item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito + '</td>';
                                    }
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Nombre de la facultad</th>'
                                    str += '<td>' + item.strNombreEstudio + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Carrera</th>'
                                    str += '<td>' + item.strNombreCarrera + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Estado</th>'
                                    str += '<td>' + (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido') + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Grado / Título</th>'
                                    str += '<td>' + item.strTipoGrado + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Periodo</th>'
                                    str += '<td>' + item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal) + '</td>'
                                    str += '</tr>';
                                    str += '<tr><td colspan="2" class="separatorItem">&nbsp;</td></tr>';

                                    $('#tblUniversitario').append(str);
                                    $('#tblUniversitario').show();

                                    break;
                                case 4:
                                    //postgrado
                                    itemcountPos += 1;

                                    str += '<tr>';
                                    str += '<th>Tipo</th>'

                                    if (item.intTipoPostgrado == 1) {
                                        str += '<td>Maestria</td>';
                                    } else if (item.intTipoPostgrado == 2) {
                                        str += '<td>Doctorado</td>';
                                    } else if (item.intTipoPostgrado == 3) {
                                        str += '<td>' + item.strOtroTipoDocumento + '</td>';
                                    }
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Nombre del centro de estudios</th>'
                                    str += '<td>' + item.strNombreCentro + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Lugar:</th>'
                                    if (item.strFgExtranjero == 1) {
                                        str += '<td>' + item.strPais + '</td>';
                                    } else {
                                        str += '<td>' + item.strPais + ' - ' + item.objUbigeoBE.strDepartamento + ' - ' + item.objUbigeoBE.strProvincia + ' - ' + item.objUbigeoBE.strDistrito + '</td>';
                                    }
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Especialidad</th>'
                                    str += '<td>' + item.strNombreEstudio + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Estado</th>'
                                    str += '<td>' + (item.strFgConcluido == '1' ? 'Concluido' : 'No concluido') + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Grado/Titulo</th>'
                                    str += '<td>' + item.strTipoGrado + '</td>'
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Periodo</th>'
                                    str += '<td>' + item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal) + '</td>'
                                    str += '</tr>';
                                    str += '<tr><td colspan="2" class="separatorItem">&nbsp;</td></tr>';

                                    $('#tblPostgrado').append(str);
                                    $('#tblPostgrado').show();
                                    break;
                                }

                            });

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

                /* candidato cargos partidario */
                $.ajax({
                    url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/CargoPartidarioListarPorCandidato",
                    data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoBE) + '}',
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (jsondata) {

                        if (jsondata.d.length == 0) {
                            imprimeDato("lblCargosPartidarios",'No cuenta con cargos partidarios.')
                        }

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var str = '';

                                str += '<tr>';
                                str += '<th style="width:20%;">Organización Política</th>';
                                str += '<td style="width:30%;">' + item.strOrganizacionPolitica + '</td>';
                                str += '<th style="width:20%;">Ámbito o circunscripción</th>';
                                str += '<td style="width:30%;">' + item.objAmbitoBE.strAmbito + '</td>';
                                str += '</tr>';
                                str += '<tr>';
                                str += '<th>Cargo</th>';
                                str += '<td>' + item.strNombre_Cargo + '</td>';
                                str += '<th>Periodo</th>';
                                str += '<td>' + item.intAnio_Inicio + ' - ' + (item.intAnio_Final == 0 ? strMsgHastaActualidad : item.intAnio_Final) + '</td>';
                                str += '</tr>';
                                str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                $('#tblCargoPartidario').append(str);
                                $('#tblCargoPartidario').show();

                            });
                        }
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
                            $.each(jsondata.d, function (i, item) {
                                if (jsondata.d.length == 0) {
                                    imprimeDato("lblCargosEleccion",'No cuenta con cargos de elección popular.')
                                }

                                var str = '';
                                var _dep = "";
                                var _pro = "";
                                var _dis = "";
                                var _pob = "";

                                if (item.objUbigeoCargoPopularBE.strDepartamento != "") { _dep = item.objUbigeoCargoPopularBE.strDepartamento }
                                if (item.objUbigeoCargoPopularBE.strProvincia != "") { _pro = " - " + item.objUbigeoCargoPopularBE.strProvincia }
                                if (item.objUbigeoCargoPopularBE.strDistrito != "") { _dis = " - " + item.objUbigeoCargoPopularBE.strDistrito }
                                if (item.strCentroPoblado != "") { _pob = " - " + item.strCentroPoblado }

                                str += '<tr>';
                                str += '<th>Organizacion Política por la que postuló</th>';
                                str += '<td>' + item.strOrganizacionPolitica + '</td>';
                                str += '<th>Ámbito</th>';
                                str += '<td>' + item.objAmbitoBE.strAmbito + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Cargo</th>';
                                if (item.objAmbitoBE.intIdAmbito == 6) {
                                    str += '<td>' + item.strOtroCargo + '</td>';
                                } else {
                                    str += '<td>' + item.objCargoAutoridadBE.strCargoAutoridad + '</td>';
                                }
                                str += '<th>Lugar</th>';
                                str += '<td>' + _dep + _pro + _dis + _pob + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Proceso Electoral</th>';
                                str += '<td>' + item.strProcesoElectoral + '</td>';
                                str += '<th>Periodo</th>';
                                str += '<td>' + item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal) + '</td>';
                                str += '</tr>';
                                str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                $('#tblCargoEleccion').append(str);
                                $('#tblCargoEleccion').show();

                            });
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

                        if (jsondata.d.length == 0) {
                            imprimeDato("lblMilitancia",'No cuenta con militancia en otros partidos.')
                        }

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var str = '';

                                str += '<tr>';
                                str += '<th coslpan="2">Denominación de la O.P. a la que renunció o cuya inscripción fue cancelada</th>';
                                str += '<td coslpan="2">' + item.strOrgPolitica + '</td>';
                                str += '</tr>';
                                str += '<tr>';
                                str += '<th>Periodo</th>';
                                str += '<td>' + item.intAnioInicio + ' - ' + (item.intAnioFinal == 0 ? strMsgHastaActualidad : item.intAnioFinal) + '</td>';
                                str += '</tr>';
                                str += '<tr><td colspan="2" class="separatorItem">&nbsp;</td></tr>';

                                $('#tblRenuncias').append(str);
                                $('#tblRenuncias').show();

                            });
                        }

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

                            if (jsondata.d.length == 0) {
                                $('#tblAmbitoPenal').parent().parent().parent().parent().removeClass('tblVacio');
                                imprimeDato("lblAmbitoPenal",'No cuenta con antecedentes penales.')
                            }

                            $.each(jsondata.d, function (i, item) {
                                var str = '';

                                str += '<tr>';
                                str += '<th>Número de expediente</th>';
                                str += '<td>' + item.strExpediente + '</td>';
                                str += '<th>Fecha de sentencia firme</th>';
                                str += '<td>' + item.strFecha_Sentencia.substring(0, 2) + '/' + item.strFecha_Sentencia.substring(2, 4) + '/' + item.strFecha_Sentencia.substring(4, 8) + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Juzgado</th>';
                                str += '<td>' + item.strJuzagado + '</td>';
                                str += '<th>Delito</th>';
                                str += '<td>' + item.strAcusacion_Penal + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Fallo</th>';
                                str += '<td colspan="3">' + item.strFallo + '</td>';
                                str += '</tr>';

                                str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';


                                $('#tblAmbitoPenal').append(str);
                                $('#tblAmbitoPenal').show();

                            });
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

                        if (jsondata.d.length == 0) {
                            $('#tblAmbitoCivil').parent().parent().parent().parent().removeClass('tblVacio');
                            imprimeDato("lblAmbitoCivil",'No cuenta con antecedentes civiles.')
                        }

                        if (jsondata.d) {
                            $.each(jsondata.d, function (i, item) {
                                var str = '';

                                str += '<tr>';
                                str += '<th>Materia</th>';
                                str += '<td>' + item.objTipoMateriaBE.strMateria + '</td>';
                                str += '<th>Número de expediente</th>';
                                str += '<td>' + item.strExpediente + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Juzgado</th>';
                                str += '<td>' + item.strJuzgado + '</td>';
                                str += '<th>Materia de la demanda</th>';
                                str += '<td>' + item.strMateria + '</td>';
                                str += '</tr>';

                                str += '<tr>';
                                str += '<th>Fallo</th>';
                                str += '<td colspan="3">' + item.strFallo + '</td>';
                                str += '</tr>';

                                str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                $('#tblAmbitoCivil').append(str);
                                $('#tblAmbitoCivil').show();

                            });
                        }

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
                                $.each(jsondata.d, function (i, item) {
                                    var str = '';

                                    str += '<tr>';
                                    str += '<th>Cargo</th>';
                                    str += '<td>' + item.strCargo + '</td>';
                                    str += '<th>Entidad</th>';
                                    str += '<td>' + item.strInstitucion + '</td>';
                                    str += '</tr>';

                                    str += '<tr>';
                                    str += '<th>Periodo</th>';
                                    str += '<td colspan="3">' + item.intAnio_Inicio + ' - ' + (item.intAnio_Final == 0 ? strMsgHastaActualidad : item.intAnio_Final) + '</td>';
                                    str += '</tr>';

                                    str += '<tr><td colspan="4" class="separatorItem">&nbsp;</td></tr>';

                                    $('#tblAdicional').append(str);
                                    $('#tblAdicional').show();

                                });
                            }

                        }, error: function (xhr, status, error) {
                            imprimeDato("lblOtraExperiencia",'No se pudo obtener la información, vuelva a  intentar.')
                        }
                    });
                } else if (objCandidato.strExperienciaOtra == '0' || objCandidato.strExperienciaOtra == '') {
                    imprimeDato("lblOtraExperiencia",'No registró información.')
                }

                //console.log(objCandidato.strIngresos);

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
                                    $('#tblIngresos').show();
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

    $('#btnImprimir').click(function (e) {
        $(this).hide();
        window.focus();
        window.print();
        $(this).show();
    });

    $('#btnDescargarPDF').click(function (e) {
        window.open("../declaraciones/declaracionpdf.aspx?c=" + idCandidato + "&p=" + idProceso + "&op=" + idOrgPolitica);
    });

    return lista_datos;
};
// end document ready

String.prototype.right = function (n) {
    return this.substr((this.length - n), this.length);
};

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function formatNumber(number, decimal) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(decimal);
}

function MostrarFotoDNI(strDNI, blnRegistraFoto) {
    var objCandidatoNewBE = new Object();
    objCandidatoNewBE.strDNI = strDNI;
    $.ajax({
        url: "http://200.48.102.67/pecaoe/servicios/declaracion.asmx/ObtenerRutaFotoDNI",
        data: '{"objCandidatoBE":' + JSON.stringify(objCandidatoNewBE) + '}',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (jsondata) {
            $('#fotoCandidato').attr('src', jsondata.d[0]);
        },
        error: function (xhr, status, error) {
            $("#divAlert").dialog('open');
            $("#spnAlert").empty().html(xhr.responseText);
        }
    });
}
