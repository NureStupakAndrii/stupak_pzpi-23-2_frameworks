const jsonString = `{
  "name": "Alex",
  "age": 25,
  "skills": ["HTML", "CSS", "JavaScript"],
  "address": {
    "city": "Kyiv",
    "country": "Ukraine"
  }
}`;

const parsedJson = JSON.parse(jsonString);

function displayJson(json, level = 0) {
  const indent = " ".repeat(level);

  if (Array.isArray(json)) {
    console.log(indent + "Array");

    json.forEach((item, index) => {
      if (isPrimitive(item)) {
        console.log(indent + "  [" + index + "]: " + item);
      } else {
        console.log(indent + "  [" + index + "]:");
        displayJson(item, level + 4);
      }
    });
  } else if (json !== null && typeof json === "object") {
    console.log(indent + "Object");

    Object.entries(json).forEach(([key, value]) => {
      if (isPrimitive(value)) {
        console.log(indent + "  " + key + ": " + value);
      } else {
        console.log(indent + "  " + key + ":");
        displayJson(value, level + 4);
      }
    });
  } else {
    console.log(indent + json);
  }
}

function isPrimitive(value) {
  return value === null || typeof value !== "object";
}

displayJson(parsedJson);
