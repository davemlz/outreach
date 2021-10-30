// ********************************************************************************
// LINK A ESTE SCRIPT:
// https://code.earthengine.google.com/57328d7b0f283a3276073d1c23f19293
// ********************************************************************************

// ********************************************************************************
// CREACIÓN DE SHAPES
// ********************************************************************************
// Para crear un shape se utilizan las herramientas de dibujo del mapa
// Las herramientas de dibujo se encuentran en la esquina superior izquierda del mapa
// Se pueden crear geometrías de puntos, líneas y polígonos
// En la pestaña "Geometry imports", al lado de las herramientas de dibujo, se manejan las geometrías creados
// En esa misma pestaña se crean nuevas con la opción "+ new layer"
// ********************************************************************************

// Se han creado dos geometrías de polígonos y aparecen al inicio del Script en la pestaña "Imports"
// El nombre de la geometría se puede cambiar de "geometry" a cualquier otro (sin espacios)
// No es necesario volverlos a crear en el Script con la función "var"
// Ya se pueden utilizar e imprimir en la consola
print("POLÍGONO 1",poly1);
print("POLÍGONO 2",poly2);

// Acceder a las coordenadas de los vértices del polígono, función .coordinaets()
print("COORDENADAS POLÍGONO 1",poly1.coordinates());

// Obtener el perímetro y el área de las geometrías, funciones .perimeter() y .area()
print("PERÍMETRO DEL POLÍGONO 1 (m)",poly1.perimeter());
print("ÁREA DEL POLÍGONO 1 (m^2)",poly1.area());

// Para obtener el área en Ha dividimos con la función .divide("Valor para dividir")
print("ÁREA DEL POLÍGONO 1 (Ha)",poly1.area().divide(10000^2));

// ********************************************************************************
// GEOPROCESOS
// ********************************************************************************
// Diferentes geoprocesos pueden ser aplicados sobre las geometrías
// En algunos casos deberán ser necesitados más de una geometría
// ********************************************************************************

// Crear un bufer de 100 m con la función .buffer("Valor en m")
var buffer = poly1.buffer(100);
Map.addLayer(buffer,{},"BUFFER");

// Crear un centroide con la función .centroid()
var centroid = poly1.centroid();
Map.addLayer(centroid,{color: "#000000"},"CENTROID");

// Crear la envolvente convexa con la función .convexHull()
var convex = poly2.convexHull();
Map.addLayer(convex,{color: "#0000FF"},"CONVEX HULL");

// Realizar la intersección con la función .intersection("Segunda geometría")
var inter = poly1.intersection(poly2);
Map.addLayer(inter,{},"INTERSECTION");

// Realizar la unión con la función .union("Segunda geometría")
var uni = poly1.union(poly2);
Map.addLayer(uni,{},"UNION");

// Realizar la diferencia con la función .difference("Segunda geometría")
var diff = poly1.difference(poly2);
Map.addLayer(diff,{},"DIFFERENCE");

// Realizar la diferencia simétrica con la función .symmetricDifference("Segunda geometría")
var symdiff = poly1.symmetricDifference(poly2);
Map.addLayer(symdiff,{},"SYMMETRIC DIFFERENCE");

// ********************************************************************************
// GEOMETRÍAS A SHAPEFILES
// ********************************************************************************
// Las geometrías sólo son la parte vectorial del shape
// Para asignar atributos hay que convertir las geometrías a shapes
// ee.Feature("Geometría") convierte la geometría a shape
// .set({"Atributo1":"Valor1","Atributo2":"Valor2",...}) asigna valores a atributos
// ********************************************************************************

// Convierte la geometría "poly1" al shape "shape"
var shape = ee.Feature(poly1)

// Crea dos atributos: Lote y Area
// Al atributo "Lote" se le asigna el valor 1
// Al atributo "Area" se le asigna el cálculo del área de la geometría
var shape = shape.set({
  Lote:1,
  Area:poly1.area().divide(10000^2)
});

// Imprimir en la consola el shape
print("GEOMETRÍA A SHAPE",shape);
