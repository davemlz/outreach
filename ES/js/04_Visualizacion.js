// ********************************************************************************
// VISUALIZACIÓN
// ********************************************************************************
// Todos los objetos espaciales (Imágenes y shapes) pueden visualizarse en el mapa
// El mapa tiene por defecto el nombre de variable "Map"
// ********************************************************************************

// Traemos un shapefile
var shape = ee.FeatureCollection("users/dmlmont/Taller_GEE_Univalle/SHP");

// Traemos una imagen Sentinel-2
var s2 = ee.ImageCollection("COPERNICUS/S2")
  .filterDate("2019-01-01","2019-03-01")
  .filterBounds(shape)
  .first();

// ********************************************************************************
// OPCIONES DE VISUALIZACIÓN
// ********************************************************************************
// La visualización depende de las opciones dadas
// Las opciones pueden variar dependiendo de la imagen o shape
// ********************************************************************************

// ********************************************************************************
// OPCIONES BÁSICAS DE VISUALIZACIÓN DE SHAPES
// ********************************************************************************
// color: "Código HEX de un color"
// strokeWidth: "Grosor de la línea en pixeles"
// ********************************************************************************

// Visualización de shape en color rojo con grosor de línea 5
var shape_options = {
  color:'FF0000',
  strokeWidth: 5
};

// ********************************************************************************
// OPCIONES BÁSICAS DE VISUALIZACIÓN DE IMÁGENES
// ********************************************************************************
// min: "Valor mínimo de la imagen a visualizar (por lo general es cero)"
// max: "Valor máximo de la imagen a visualizar (no tiene que ser el máximo)"
// bands: "Lista de bandas para componer"
// ********************************************************************************

// Visualización de imagen en valores de 0 a 3000 de las bandas visibles de Sentinel-2
var s2_options_RGB = {
  min: 0,
  max: 3000,
  bands: ["B4","B3","B2"]
};

// Visualización de imagen en valores de 0 a 5000 de las bandas NIR, Rojo y Azul de Sentinel-2
var s2_options_NIR = {
  min: 0,
  max: 5000,
  bands: ["B8","B4","B2"]
};

// ********************************************************************************
// ADICIONAR OBJETOS AL MAPA
// ********************************************************************************
// Los objetos se adicionan con la función .addLayer("Objeto","Opciones de visualización","Nombre de Layer")
// Se pueden adicionar varios objetos al mapa
// El orden de visualización es igual al orden de adición
// ********************************************************************************

// Adicionar imagen Sentinel-2 en RGB
Map.addLayer(s2,s2_options_RGB,"SENTINEL-2 RGB");

// Adicionar imagen Sentinel-2 en NIR
Map.addLayer(s2,s2_options_NIR,"SENTINEL-2 NIR");

// Adicionar shapefiles
Map.addLayer(shape,shape_options,"SHAPEFILE");

// Centrar el mapa en el ojeto shapefile
// También puede centrarse en una imagen
// Se utiliza la función .centerObject("Objeto")
Map.centerObject(shape);