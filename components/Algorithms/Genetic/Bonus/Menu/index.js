import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu() {
    return (
        <MenuWrapper
            title="Генетический алгоритм"
            description="Сейчас вы узрите, как выполняется генерация кода для вывода последовательности Фибоначчи."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={() => {}}
                    disabled={true}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={() => {}}
                    disabled={true}
                >
                    Отменить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
