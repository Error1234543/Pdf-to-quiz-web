async function uploadPDF(){
  const file=document.getElementById("pdfInput").files[0];
  if(!file) return alert("Please upload a PDF!");
  document.getElementById("loading").style.display="block";
  const form=new FormData();
  form.append("pdf",file);
  const res=await fetch("https://your-render-url.onrender.com/upload",{method:"POST",body:form});
  const data=await res.json();
  document.getElementById("loading").style.display="none";
  document.getElementById("quizBox").innerHTML="<pre>"+JSON.stringify(data.quiz,null,2)+"</pre>";
}