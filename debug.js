var Debug = function(text, type, value)
{
  if(type != null && type.toString() != "")
  {
    console.log(text + " || " + type + " || " + value);
  }
  else if(value != null && value.toString() != "")
  {
    console.log(text + " || " + value);
  }
  else
  {
    console.log(text);
  }
}

module.exports = Debug;
