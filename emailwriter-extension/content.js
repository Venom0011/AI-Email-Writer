console.log("Email Writer Extension");

function getEmailContent(){
    const selectors=[
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]',
    ];

    for(const selector of selectors){
        const content =document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
    }
    return null;
}

function createAIButton() {
    const button=document.createElement('div');
    button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight='8px';
    button.innerHTML='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
}

function findComposeToolBar() {
    const selectors=[
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for(const selector of selectors){
        const toolbar =document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    const existingButton=document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar=findComposeToolBar();
    if(!toolbar){
        console.log("ToolBar not found");
        return;
    }
    console.log("ToolBar found");
    const button=createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try{
            button.innerHTML='Generating ....';
            button.disabled=true;

            const emailContent= getEmailContent();
            const response=await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    emailContent:emailContent,
                    tone:"Professional"
                })
            });

            if(!response.ok){
                throw new Error("Something went wrong");
            }

            const data = await response.json();
            const generatedReply = data.message;

            const composeBox=document.querySelector('[role="textbox"][g_editable=true]')
            
            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
            }
        } catch(error){
            console.log(error);
            alert("Somethig went wrong...")
        }finally{
            button.innerHTML='AI Reply';
            button,disabled=false;
        }
    })
    
    toolbar.insertBefore(button,toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNotes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNotes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || 
            (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.aDh, .btC, [role="dialog"]')))
        );

        if (hasComposeElements) {
            console.log("compose window");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
