function anonymous(data) {
var out='<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello</title>\n  </head>\n  <body>\n    <p>before</p>\n    <p>';var arr1=data.arr;if(arr1){var v,i=-1,l1=arr1.length-1;while(i<l1){v=arr1[i+=1];out+=(v)+'\n';} } out+='</p>\n    <p>after</p>\n  </body>\n</html>\n';return out;
}
exports.render = anonymous;