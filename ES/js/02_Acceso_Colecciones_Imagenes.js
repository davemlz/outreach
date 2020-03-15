// ********************************************************************************
// ACCESO A COLECCIONES
// ********************************************************************************
// Las colecciones son el conjunto de imágenes de un sensor específico
// Se accede a las colecciones con la fución ee.ImageCollection("Ruta de la colección en catálogo")
// ********************************************************************************

// Acceso a la colección de imágenes de Sentinel-1 (RADAR)
// Accede a todas las imágenes desde que el sensor inició la captura de información
// La colección se guarda en la variable "s1"
var s1 = ee.ImageCollection("COPERNICUS/S1_GRD");

// Imprimir en consola las 10 primeras imágenes de la colección "s1"
// Con la función .limit("Número") se limita el número de imágenes de una colección
// En la consola no se pueden imprimir todas las imágenes de una colección
// Se pueden imprimir varias variables con una sola función "print", aquí un texto y una colección
print("COLECCIÓN SENTINEL-1",s1.limit(10));

// ********************************************************************************
// ACCESO A IMÁGENES
// ********************************************************************************
// las imágenes corresponden a una captura en una fecha específica de una colección de un sensor
// Se utiliza el código id de la imagen a utilizar para acceder a la imagen
// El código id puede verse en la consola al imprimir una colección
// Las imágenes aparecen como una lista de Features, cada Feature es una imagen
// Al dar click en un Feature el código id estará entre sus atributos
// Se accede a las imágenes con la fución ee.Image("Ruta de la imagen en la colección")
// ********************************************************************************

// Acceso a una imagen de la colección de Sentinel-1 (RADAR)
// La colección se guarda en la variable "s1_image"
var s1_img = ee.Image("COPERNICUS/S1_GRD/S1A_EW_GRDH_1SDH_20141003T003636_20141003T003740_002658_002F54_ECFA");

// Imprimir en la consola la imagen "s1_img"
print("IMAGEN SENTINEL-1",s1_img);

// ********************************************************************************
// FILTROS POR FECHA
// ********************************************************************************
// Los filtros por fecha se realizan sobre colecciones de imágenes
// En la variable asignada sólo quedarán aquellas imágenes entre las fechas establecidas
// La función para filtrar por fecha es .filterDate("Fecha Inicial","Fecha Final")
// .filterDate es un método aplicable sólo a colecciones y se pone con un "." después de la variable
// ********************************************************************************

// Acceso a la colección de imágenes de Sentinel-2 (MULTIESPECTRAL)
// La colección se guarda en la variable "s2"
var s2 = ee.ImageCollection("COPERNICUS/S2");

// Filtrar la colección entre las fechas "2016-01-01" y "2016-06-01"
var s2_filtrada = s2.filterDate("2016-01-01","2016-06-01")

// Imprimir en consola las 10 primeras imágenes de la colección "s2" filtrada
print("COLECCIÓN SENTINEL-2 FILTRADA POR FECHA",s2_filtrada.limit(10));

// Acceso a una imagen de la colección de Sentinel-2 filtrada (MULTIESPECTRAL)
// La imagen se guarda en la variable "s2_image"
var s2_img = ee.Image("COPERNICUS/S2/20160101T000037_20160101T030455_T56LNK");

// Imprimir en la consola la imagen "s2_img"
print("IMAGEN SENTINEL-2",s2_img);

// ********************************************************************************
// FILTROS POR UBICACIÓN
// ********************************************************************************
// Los filtros por ubicación se realizan sobre colecciones de imágenes
// En la variable asignada sólo quedarán aquellas imágenes que "toquen" el objeto ubicado
// La función para filtrar por ubicación es .filterBounds("Geometría de objeto")
// .filterBpunds es un método aplicable sólo a colecciones y se pone con un "." después de la variable
// ********************************************************************************

// Traemos un shapefile para el filtro
var shape = ee.FeatureCollection('path/SHP');

// Acceso a la colección de imágenes de Landsat-8 (MULTIESPECTRAL)
// La colección se guarda en la variable "l8"
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");

// Filtrar la colección por la ubicación de objetos en la variable "shape"
var l8_filtrada = l8.filterBounds(shape);

// Imprimir en consola las 10 primeras imágenes de la colección "l8" filtrada
print("COLECCIÓN LANDSAT-8 FILTRADA POR UBICACIÓN",l8_filtrada.limit(10));

// Acceso a una imagen de la colección de Landsat-8 filtrada (MULTIESPECTRAL)
// La imagen se guarda en la variable "l8_image"
var l8_img = ee.Image("LANDSAT/LC08/C01/T1_SR/LC08_009058_20130401");

// Imprimir en la consola la imagen "l8_img"
print("IMAGEN LANDSAT-8",l8_img);

// ********************************************************************************
// VARIOS FILTROS AL TIEMPO
// ********************************************************************************
// Se pueden aplicar filtros de fecha y ubicación al tiempo
// Ambos se ponen con un "." inmediatamente después del otro en la variable de la colección
// ********************************************************************************

// Acceso a la colección de imágenes de Landsat-7 (MULTIESPECTRAL)
// La colección se guarda en la variable "l7_filtrada"
// La colección se filtra por fechas "2008-01-01" a "2009-01-01"
// La colección se filtra por la ubicación de objetos en la variable "shape"
var l7_filtrada = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")
  .filterDate("2008-01-01","2009-01-01")
  .filterBounds(shape);

// Imprimir en consola las 10 primeras imágenes de la colección "l7"
print("COLECCIÓN LANDSAT-7 FILTRADA POR FECHA Y UBICACIÓN",l7_filtrada.limit(10));

// Acceso a una imagen de la colección de Landsat-7 (MULTIESPECTRAL)
// La colección se guarda en la variable "l7_image"
var l7_img = ee.Image("LANDSAT/LE07/C01/T1_SR/LE07_009058_20080320");

// Imprimir en la consola la imagen "l7_img"
print("IMAGEN LANDSAT-7",l7_img);
