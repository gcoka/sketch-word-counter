var fs = require('fs');
const dirname = `${__dirname}/pages`

/**
 * マルチバイト文字の数をカウント
 */
function countMultibyteLetter(strSrc){
	len = 0;
	strSrc = escape(strSrc);
	for(i = 0; i < strSrc.length; i++){
		if(strSrc.charAt(i) == "%"){
			if(strSrc.charAt(++i) == "u"){
				i += 3;
				len++;
			}
			i++;
		}
	}
	return len;
}

let count = 0;
const textList = new Map();

// ファイル全部読んで、重複を除いたテキストを抽出
const files = fs.readdirSync(dirname);

var fileList = files.map(file => `${dirname}/${file}`)
.filter(function(fullpath){
    return fs.statSync(fullpath).isFile() && /.*\.json$/.test(fullpath);
})
.forEach((fullpath)=>{
    const text = fs.readFileSync(fullpath, "utf8");
    // "value":"住所"

    const properties  = text.split(/[\{\},]/);
    properties.forEach(prop => {
        const mArray = /"value":"(.*)"/g.exec(prop);
        if(mArray && mArray.length > 1){
            if (mArray[1])
            textList.set(mArray[1], 1)
        }
    });
});

for(const key of textList.keys()){
    console.log(key);
    count += countMultibyteLetter(key);
}
console.log(`マルチバイト文字数: ${count}`);