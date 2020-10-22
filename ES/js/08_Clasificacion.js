// ********************************************************************************
// LINK A ESTE SCRIPT:
// https://code.earthengine.google.com/d8ea5372937c579dfb4a25732774481e
// ********************************************************************************

// Traemos una imagen
var image = ee.Image("COPERNICUS/S2/20180226T153609_20180226T153610_T18NUJ");

// Opciones de visualización en NIR
// La imagen se visualizará para dibujar los polígonos de entrenamiento
var visNIR = {
  bands: ['B8', 'B4', 'B2'],
  min: 0,
  max: 5000
};

// Se adiciona la imagen al mapa
Map.centerObject(image);
Map.addLayer(image,visNIR,"NIR");

// Aquí se dibujan los polígonos
// Se utilizan las herramientas de dibujo
// Se dibujan polígonos por clase
// Cuando se cambia de clase se selecciona "+ new layer"

// Los polígonos se deben convertir a shape y se debe crear una columna de clase
// En este caso la columna se llama "class"
// A lo que es caña se le asigna el valor 1
// A lo que es suelo se le asigna el valor 2
var feature_urbano = ee.Feature(poly_urbano).set({class:0});
var feature_agricola = ee.Feature(poly_agricola).set({class:1});
var feature_suelo = ee.Feature(poly_suelo).set({class:2});
var feature_nube = ee.Feature(poly_nube).set({class:3});
var feature_sombra = ee.Feature(poly_sombra).set({class:4});
var feature_agua = ee.Feature(poly_agua).set({class:5});

// Los shapes se convierten a una colección de shapes
// Se usa así: ee.FeatureCollection(["Sahpe1","Shape2",...])
var fc = ee.FeatureCollection([feature_urbano,feature_agricola,feature_suelo,feature_nube,feature_sombra,feature_agua]);

// Con la función .sampleRegions("Opciones de entrenamiento") se extrae la información de entrenamiento
// Las opciones de entrenamiento son las siguientes
// collection es la colección de shapes
// properties es el nombre de la columna que representa la clase
// scale es el tamaño del pixel
// Es recomendable no trabajar tamaños de pixel menores a 0.1
var training = image.sampleRegions({
  collection: fc,
  properties: ['class'],
  scale: 10
});

// Con la función ee.Classifier.svm("Opciones de clasificador") se inicia el clasificador
// Es una Máquina de Soporte Vectorial (svm)
// Pero se pueden usar otras
// Las opciones están por defecto

// var classifier = ee.Classifier.svm();
// var classifier = ee.Classifier.naiveBayes();
var classifier = ee.Classifier.minimumDistance();
// var classifier = ee.Classifier.randomForest(500);

// El clasificador se entrena con la función .train("Sample Regions","Columna de clase","Lista de bandas a usar")
// Aquí se usa la información guardada en la variable "training"
// La columna de clase es "class"
// Y se usan todas las bandas de la imagen
var S2Bands = ['B2','B3','B4','B8'];

var trained = classifier.train(training, 'class', S2Bands);

// La imagen se clasifica con el clasificador entrenado "trained"
var classified = image.classify(trained);

var pal = ["#FF0000","#27FF00","#95702E","#FFFFFF","#000000","#0074FF"];

// Se adiciona la clasificación al mapa
// Las opciones de visualización ponen en min el valor mínimo asignado a la clase
// En max el valor máximo asignado a la clase
// Como sólo hay dos clases y se clasificaron en 0 y 1 entonces min: 0 y max: 1
Map.addLayer(classified, {min: 0, max: 5,palette: pal}, 'Clasificacion');

// Exportar imagen
// Para exportar la imagen se usa la función Export.image.toDrive("Opciones de exportación")
// image: "Imagen a exportar"
// description: "Nombre de la imagen"
// scale: tamaño de pixel
Export.image.toDrive({
  image: classified,
  description: "Clasificacion",
  scale: 10
});
