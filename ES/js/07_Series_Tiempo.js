// ********************************************************************************
// SERIES DE TIEMPO
// ********************************************************************************
// Las series de tiempo se construyen en gráficos que pueden exportarse como tal o como tablas
// Es necesario una colección de imágenes y una region o series de regiones
// Se utiliza la función ui.Chart.image.series("Colección","Shape","Reductor","Resolución")
// ********************************************************************************

// Traemos un shape
var shape = ee.FeatureCollection("path/SHP");

// Se imprime el shape en la consola para ver sus columnas
// En Series de tiempo por región es necesario
print("SHAPEFILE",shape);

// Traemos una colección de Sentinel-2 filtrada por fecha, ubicación y metadatos
var s2 = ee.ImageCollection("COPERNICUS/S2")
  .filterDate("2018-01-01","2018-12-31")
  .filterBounds(shape)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

// Vamos a calcular el NDVI para toda la colección
// Para poder hacerlo hay que crear una función
// Se empieza llamando la clase "function", el nombre de la función y los argumentos
// En este caso el nombre de la función es "NDVI" y el argumento es "img"
// Estos dos pueden tener los nombres que se deseen
// El argumento "img" representará cada imagen de la colección
// Dentro de la función podemos crear más variables con la clase "var"
// Se crea dentro una variable "image" que será el NDVI de la imagen, recortada.
// La función .clip("shape") corta la imagen con el shape deseado
// La función .normalizedDifference("Bandas") calcula el NDVI de la imagen recortada
// La función "return" retorna la variable "image"
// La función .copyProperties() es obligatoria para mantener las fechas de las imágenes
function NDVI(img){
  var image = img.clip(shape).normalizedDifference(['B8','B2']);
  return image.copyProperties(img, ['system:time_start']);
}

// La función .map("Función") se usa para aplicar una función sobre cada imagen de una colección
// En este caso se aplica la función NDVI sobre la colección de Sentinel-2
var s2_NDVI = s2.map(NDVI);

// Se crea la serie de tiempo del NDVI
var ts = ui.Chart.image.series(s2_NDVI,shape,ee.Reducer.mean(),10);

// Se imprime la serie de tiempo en la consola
// Es un gráfico
print(ts);

// ********************************************************************************
// SERIES DE TIEMPO POR REGIÓN
// ********************************************************************************
// Para las series de tiempo por región se necesitan otros parámetros
// Se utiliza la función ui.Chart.image.seriesByRegion("Colección","Shape","Reductor","Nombre de la banda","Resolución","Propiedad de tiempo","Atributo del shape")
// El atributo del shape es importante ya que será el divisor de las regiones
// Si no se ponde el atributo del shape se hará por defecto la división con el id otorgado por GEE
// ********************************************************************************

// Se crea la serie de tiempo por regiones
// El reductor es la media: ee.Reducer.mean()
// El nombre de la banda del NDVI es "nd"
// Si no saben el nombre da la banda pueden saberlo con la función .bandNames()
// "system:time_start" es la propiedad de tiempo de la colección
// "COD_UNICO" es el atributo del shape elegido para realizar la división
var ts_regions = ui.Chart.image.seriesByRegion(
  s2_NDVI,
  shape,
  ee.Reducer.mean(),
  "nd",
  10,
  'system:time_start',
  'Lote');

// Se imprime la serie de tiempo por región en la consola
// Es un gráfico
print(ts_regions);
