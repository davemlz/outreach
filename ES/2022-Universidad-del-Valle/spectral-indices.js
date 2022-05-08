/*
-------------------
Univalle Workshop 2022

Taller: Spectral Indices en Google Earth Engine

David Montero Loaiza

Link: https://code.earthengine.google.com/5e3c70fd06296082e66637b1bed24623
--------------------

PARTE 1: SPECTRAL INDICES A MANO
================================

Conocimientos a adquirir:
- Acceder a colecciones raster
- Usar metodos matematicos (calculadora raster)
- Agregar capas al mapa
- Opciones de visualizacion basicas
*/

// SELECCIONAMOS LA GUAJIRA DE LA BASE DE DATOS DE LA FAO
var guajira = ee.FeatureCollection("FAO/GAUL/2015/level1")
  .filter(ee.Filter.eq("ADM0_NAME","Colombia"))
  .filter(ee.Filter.eq("ADM1_NAME","Guajira"));

// AGREGAMOS LA GUAJIRA AL MAPA Y CENTRAMOS EL MAPA
Map.addLayer(guajira);
Map.centerObject(guajira);

// ACCEDEMOS AL DATASET DE MODIS
var MOD = ee.ImageCollection("MODIS/006/MCD43A4")
  .filterBounds(guajira) // FILTRAMOS POR INTERSECCION CON LA GUAJIRA
  .filterDate("2021-01-01","2022-01-02") // FILTRAMOS POR FECHA
  .median() // HACEMOS UNA COMPOSICION DE MEDIANA
  .clip(guajira) // CORTAMOS EL RASTER CON EL VECTOR DE LA GUAJIRA
  .clipToBoundsAndScale({
    geometry: guajira,
    scale: 500
  }) // CORTAMOS EL RASTER A LA EXTENSION DE LA GUAJIRA Y RE-ESCALAMOS
  .multiply(0.0001); // ESCALAMOS LA IMAGEN PARA CAMBIAR EL TIPO DE DATO (DATATYPE)

// AGREGAMOS MODIS AL MAPA EN RGB
Map.addLayer(MOD,{
  "min": 0,
  "max":0.3,
  "bands":[
      "Nadir_Reflectance_Band1",
      "Nadir_Reflectance_Band4",
      "Nadir_Reflectance_Band3"
    ]
  },
  "MODIS RGB"
);

// DEFINIMOS VARIABLES PARA CALCULAR EL NDVI (POR FACILIDAD)
var RED = MOD.select("Nadir_Reflectance_Band1");
var NIR = MOD.select("Nadir_Reflectance_Band2");

// CALCULAMOS EL NDVI A MANO
var NDVI = NIR.subtract(RED).divide(NIR.add(RED));

// AGREGAMOS EL NDVI AL MAPA
Map.addLayer(NDVI,{"min":0,"max":1},"MODIS NDVI");

/*
PARTE 2: FUNCIONES ESPECIALIZADAS
=========================================

Conocimientos a adquirir:
- Funciones especializada para calcular spectral indices
- Agregar capas al mapa
- Opciones de visualizacion basicas
*/

// SELECCIONAMOS EL AMAZONAS DE LA BASE DE DATOS DE LA FAO
var amazonas = ee.FeatureCollection("FAO/GAUL/2015/level1")
  .filter(ee.Filter.eq("ADM0_NAME","Colombia"))
  .filter(ee.Filter.eq("ADM1_NAME","Amazonas"));

// AGREGAMOS EL AMAZONAS AL MAPA Y CENTRAMOS EL MAPA
Map.addLayer(amazonas);
Map.centerObject(amazonas);

// ACCEDEMOS AL DATASET DE MODIS
var MOD = ee.ImageCollection("MODIS/006/MCD43A4")
  .filterBounds(amazonas) // FILTRAMOS POR INTERSECCION CON EL AMAZONAS
  .filterDate("2021-01-01","2022-01-02") // FILTRAMOS POR FECHA
  .median() // HACEMOS UNA COMPOSICION DE MEDIANA
  .clip(amazonas) // CORTAMOS EL RASTER CON EL VECTOR DEL AMAZONAS
  .clipToBoundsAndScale({
    geometry: amazonas,
    scale: 1000
  }) // CORTAMOS EL RASTER A LA EXTENSION DEL AMAZONAS Y RE-ESCALAMOS
  .multiply(0.0001); // ESCALAMOS LA IMAGEN PARA CAMBIAR EL TIPO DE DATO (DATATYPE)

// AGREGAMOS MODIS AL MAPA EN RGB
Map.addLayer(MOD,{
  "min": 0,
  "max":0.3,
  "bands":[
      "Nadir_Reflectance_Band1",
      "Nadir_Reflectance_Band4",
      "Nadir_Reflectance_Band3"
    ]
  },
  "MODIS RGB"
);

// DEFINIMOS PARA CALCULAR EL NIRv (POR FACILIDAD)
var NIR = MOD.select("Nadir_Reflectance_Band2");

// CALCULAMOS PRIMERO EL NDVI USANDO FUNCIONES ESPECIALIZADAS
var NDVI = MOD.normalizedDifference([
  "Nadir_Reflectance_Band2",
  "Nadir_Reflectance_Band1"
  ]
);

// CALCULAMOS NIRv CON METODOS MATEMATICOS (CALCULADORA RASTER)
var NIRv = NDVI.multiply(NIR);

// AGREGAMOS EL NDVI Y EL NIRv AL MAPA
Map.addLayer(NDVI,{"min":0,"max":1},"MODIS NDVI");
Map.addLayer(NIRv,{"min":0,"max":0.4},"MODIS NIRv");

/*
PARTE 3: EVALUANDO EXPRESIONES
=========================================

Conocimientos a adquirir:
- Expresiones: spectral indices sofisticados
- Agregar capas al mapa
- Opciones de visualizacion basicas
*/

// SELECCIONAMOS VICHADA DE LA BASE DE DATOS DE LA FAO
var vichada = ee.FeatureCollection("FAO/GAUL/2015/level1")
  .filter(ee.Filter.eq("ADM0_NAME","Colombia"))
  .filter(ee.Filter.eq("ADM1_NAME","Vichada"));

// AGREGAMOS VICHADA AL MAPA Y CENTRAMOS EL MAPA
Map.addLayer(vichada);
Map.centerObject(vichada);

// ACCEDEMOS AL DATASET DE MODIS
var MOD = ee.ImageCollection("MODIS/006/MCD43A4")
  .filterBounds(vichada) // FILTRAMOS POR INTERSECCION CON VICHADA
  .filterDate("2021-01-01","2022-01-02") // FILTRAMOS POR FECHA
  .median() // HACEMOS UNA COMPOSICION DE MEDIANA
  .clip(vichada) // CORTAMOS EL RASTER CON EL VECTOR DE VICHADA
  .clipToBoundsAndScale({
    geometry: vichada,
    scale: 1000
  }) // CORTAMOS EL RASTER A LA EXTENSION DE VICHADA Y RE-ESCALAMOS
  .multiply(0.0001); // ESCALAMOS LA IMAGEN PARA CAMBIAR EL TIPO DE DATO (DATATYPE)
  
// AGREGAMOS MODIS AL MAPA EN RGB
Map.addLayer(MOD,{
  "min": 0,
  "max":0.3,
  "bands":[
      "Nadir_Reflectance_Band1",
      "Nadir_Reflectance_Band4",
      "Nadir_Reflectance_Band3"
    ]
  },
  "MODIS RGB"
);

// DEFINIMOS LA EXPRESION DEL EVI
var EVIexp = "G * (NIR - RED) / (NIR + C1 * RED - C2 * BLUE + L)";

// DEFINIMOS LOS PARAMETROS DE LA EXPRESION
var parameters = {
  "G": 2.5,
  "NIR": MOD.select("Nadir_Reflectance_Band2"),
  "RED": MOD.select("Nadir_Reflectance_Band1"),
  "BLUE": MOD.select("Nadir_Reflectance_Band3"),
  "C1": 6.0,
  "C2": 7.5,
  "L": 1.0
};

// CALCULAMOS EL EVI
var EVI = MOD.expression(EVIexp,parameters);

// AGREGAMOS EL EVI AL MAPA
Map.addLayer(EVI,{"min":0,"max":1},"MODIS EVI");

/*
PARTE 4: MODULO SPECTRAL
=========================================

Conocimientos a adquirir:
- Requerir modulos
- Usar funciones de terceros
- Paletas de colores
- Agregar capas al mapa
- Opciones de visualizacion basicas
*/

// SELECCIONAMOS COLOMBIA DE LA BASE DE DATOS DE LA FAO
var colombia = ee.FeatureCollection("FAO/GAUL/2015/level0")
  .filter(ee.Filter.eq("ADM0_NAME","Colombia"));

// AGREGAMOS COLOMBIA AL MAPA Y CENTRAMOS EL MAPA
Map.addLayer(colombia);
Map.centerObject(colombia);

// ACCEDEMOS AL DATASET DE MODIS
var MOD = ee.ImageCollection("MODIS/006/MCD43A4")
  .filterBounds(colombia) // FILTRAMOS POR INTERSECCION CON COLOMBIA
  .filterDate("2021-01-01","2022-01-02") // FILTRAMOS POR FECHA
  .median() // HACEMOS UNA COMPOSICION DE MEDIANA
  .clipToBoundsAndScale({
    geometry: colombia,
    scale: 5000
  }) // CORTAMOS EL RASTER A LA EXTENSION DE COLOMBIA Y RE-ESCALAMOS
  .clip(colombia) // CORTAMOS EL RASTER CON EL VECTOR DE COLOMBIA
  .multiply(0.0001); // ESCALAMOS LA IMAGEN PARA CAMBIAR EL TIPO DE DATO (DATATYPE)
  
// AGREGAMOS MODIS AL MAPA EN RGB
Map.addLayer(MOD,{
  "min": 0,
  "max":0.3,
  "bands":[
      "Nadir_Reflectance_Band1",
      "Nadir_Reflectance_Band4",
      "Nadir_Reflectance_Band3"
    ]
  },
  "MODIS RGB"
);

// REQUERIMOS EL MODULO SPECTRAL
var spectral = require("users/dmlmont/spectral:spectral");

// IMPRIMIMOS LOS INDICES EN CONSOLA
print("Spectral Indices",spectral.indices);

// DEFINIMOS LOS PARAMETROS PARA CALCULAR EL NDVI, NIRv Y EVI
var params = {
  "N": MOD.select("Nadir_Reflectance_Band2"),
  "R": MOD.select("Nadir_Reflectance_Band1"),
  "B": MOD.select("Nadir_Reflectance_Band3"),
  "g": 2.5,
  "C1": 6.0,
  "C2": 7.5,
  "L": 1.0
};

// CALCULAMOS EL NDVI, NIRv Y EVI
var MOD = spectral.computeIndex(MOD,["NDVI","NIRv","EVI"],params);

// AGREGAMOS LOS INDICES AL MAPA
Map.addLayer(MOD,{"min":0,"max":1,"bands":"NDVI"},"MODIS NDVI");
Map.addLayer(MOD,{"min":0,"max":0.4,"bands":"NIRv"},"MODIS NIRv");
Map.addLayer(MOD,{"min":0,"max":1,"bands":"EVI"},"MODIS EVI");
