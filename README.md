# 智法通鉴(LawAI)——司法大数据赋能的法律服务数智化平台(基于微调大模型的智能法律辅助决策与问答系统)

<table style="margin: 0 auto;" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td align="center">
            <img width="40%" alt="favicon" src="https://github.com/user-attachments/assets/0aea9753-ecd2-4918-a40c-966a2c987a08">
            <div>法意思通明，智启新程</div>
        </td>
        <td align="center">
            <img width="50%" alt="favicon" src="https://github.com/user-attachments/assets/2cf7a9bb-8349-41b7-adb9-2c78abd8e0c1">
            <div>法之昭昭，其路遥遥</div>
        </td>
    </tr>
</table>

# Web
<img width="1218" alt="1" src="https://github.com/user-attachments/assets/87479347-572d-4690-ba81-3497d328c8db" />
<img width="1218" alt="2" src="https://github.com/user-attachments/assets/a1415cd2-799e-457f-971f-5bed86a4f448" />
<img width="1218" alt="3" src="https://github.com/user-attachments/assets/2b90115c-589f-49f3-8c73-b59c211c64ed" />
<img width="1218" alt="4" src="https://github.com/user-attachments/assets/4e6d364e-6c79-41ee-8e17-8930daf556dc" />
<img width="1218" alt="5" src="https://github.com/user-attachments/assets/afd73ce5-3760-49ef-8531-3e6843e3eeec" />
<img width="1218" alt="6" src="https://github.com/user-attachments/assets/6f082307-8157-431c-af3c-ff3e3f13975e" />
<img width="1218" alt="7" src="https://github.com/user-attachments/assets/e7780e11-42fd-4088-95fe-1ae82b8c6ec6" />
<img width="1218" alt="8" src="https://github.com/user-attachments/assets/b6c4d134-ecae-433f-bb0c-e2d8c6e9bcbd" />


# LawAI Models
## <a href="https://huggingface.co/StarUniver/Qwen-LawLLM">LawAI-Qwen</a>
- **Base Model**:Based on `Qwen7b`.
- **Enhancements**: Significantly increased training data volume and rounds (about **2** days of training).
- **Limitation**:Partial overfitting occurs(Caused by **2w** pairs of Q&A with **30** epochs of training).
## <a href="https://huggingface.co/StarUniver/lawllm-gguf">LawAI-7B</a>
- **Base Model**:Based on `llama3`.
- **Enhancements**: Trained for non-professional legal knowledge Q&A (**2** hours of training).
- **Limitation**:Limited support for Chinese and limited dataset (**8000** pairs of non-professional Q&A).

<a href="https://huggingface.co/StarUniver/lawllm-gguf"><strong>HuggingFace</strong></a>

# Introduction
Large Language Models (LLMs) have demonstrated strong universality in various fields. However, in vertical domains such as the legal field, the performance of these large models often leaves much to be desired. The reason lies in the fact that the legal field involves a vast amount of professional knowledge, complex legal principles, and highly refined rules and practices. Relying solely on general-purpose large models makes it difficult to achieve the ideal effect of legal consulting services.

To compensate for this deficiency, we have decided to develop the LawAI model, focusing on the application in the legal field. Our goal is to enable the model to deeply understand and apply legal knowledge through refined learning and training, thereby providing users with more accurate and reliable legal consulting services.

* Focused on the Legal Field: Unlike general-purpose large models, the LawAI model specializes in the legal field. Through the input of a large amount of legal professional knowledge and practical experience, it possesses a stronger legal professionalism.

* Refined Learning: We have conducted refined training for the model, including the study of legal provisions, analysis of cases, understanding of legal principles, etc., to ensure that the model can accurately grasp the core essentials of the legal field.

