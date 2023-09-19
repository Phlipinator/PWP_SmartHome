import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import React, { useRef } from 'react'

interface AlertProps {
  isOpen: boolean
  onClose: () => void
  onClick: () => void
  headerText: string
  bodyText: string
  confirmButtonText: string
}

const Alert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  onClick,
  headerText,
  bodyText,
  confirmButtonText,
}: AlertProps) => {
  const cancelRef = useRef(null)

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent
          backgroundColor='customBackground.card'
          color='white'
          marginLeft={2}
          marginRight={2}
        >
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {headerText}
          </AlertDialogHeader>

          <AlertDialogBody>{bodyText}</AlertDialogBody>

          <AlertDialogFooter color='black'>
            <Button variant='solid' ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onClick} ml={3}>
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export { Alert }
