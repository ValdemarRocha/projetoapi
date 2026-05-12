// DECLARAÇÕES DOS ELEMENTOS USANDO DOM(DOCUMENT OBJECT MODEL)
const videoElemento = document.getElementById("video");
const botaoScan = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// FUNÇÃO QUE VAI HABILITAR A CÂMERA


async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"}, //habilitando a câmera traseira
            audio:false
        })
        videoElemento.srcObject = midia;
        videoElemento.play(); //garante que o video comece
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera", erro;
    }
    
}
//Executa a função da câmera
configurarCamera();

//Função para ler o texto da imagem e mostrar na tela
botaoScan.onclick = async()=>{
    botaoScan.disable= true;
    resultado.innerText="Fazendo a leitura...aguarde";

    //Chama a estrutura do canvas 
    const context = canvas.getcontext("2d");

    //Ajusta o tamanho da tela
    canvas.width = videoElemento.videoWidth; //Largura
    canvas.Height = videoElemento.videoHeight; //Altura

    //Reset de qualquer transformação para garantir que a foto não
    //fique invertida
    context.setTransform(1, 0, 1, 0, 0);

    //Aplica o filtro de contraste e escala de cinza no canvas de
    //tirar a foto (ajuda a evitar letras aleatórias)
    context.filter = 'contrast(1.2) grayscale(1)';

    //Construindo a tela para tirar a foto
    context.drawImage(videoElemento, 0, 0, canvas.width,canvas.Height);

    try{
        const {data:{ text }} = await Tesseract.recognize(
            canvas,
            'por'
        );
        //Remove espaços excessivos e caracters especiais
        const textoFinal = text.trim();
        //condicional ternaria ? if ? else - se o texto for maior ok senão mensagem
        resultado.innertext = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto";
        
    }catch(erro){
        console.error(erro);
        resultado.innerText = "Erro ao processar", erro;
    }finally{
        //Desabilita o botão para começar nova leitura
        botaoScan.disable = false;

    }

}