import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

// logic
import { useContext } from "react";
import { AuthModalContext } from "../../../store/ AuthModalProvider";

// components
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

function AuthModal() {
  const { modalSettings, setModalSettings } = useContext(AuthModalContext);

  const handleClose = () => {
    setModalSettings({ ...modalSettings, open: false });
  };

  return (
    <>
      <Modal isOpen={modalSettings.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalSettings.view === "login" && "Login"}
            {modalSettings.view === "signup" && "Sign Up"}
            {modalSettings.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mb="6">
            {modalSettings.view === "login" ||
            modalSettings.view === "signup" ? (
              <>
                <OAuthButtons />
                <Text
                  textAlign="center"
                  fontWeight={700}
                  color="gray.500"
                  mb="6"
                >
                  OR
                </Text>
                <AuthInputs />
              </>
            ) : (
              <ResetPassword />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AuthModal;
