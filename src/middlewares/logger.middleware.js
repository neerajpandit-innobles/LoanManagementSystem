import fs from "fs"

export function logReqRes(filename){
  return (req,res,next)=>{
    fs.appendFile(
      filename,
      `\n${new Date().toLocaleString()}:${req.ip} ${req.method}: ${req.path} ${JSON.stringify(req.body)} \n`,
      (err,data)=>{
        next();
      }
    );
  };
}

