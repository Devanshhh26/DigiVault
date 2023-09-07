pragma solidity ^0.5.0;

contract Storage {
 string public name ='Storage';
  // Number of files
  uint public fileCount=0;
  // Mapping fileId=>Struct 
  mapping(uint=>File) public files;

  // Struct
  struct File{
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  // Event
   event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address payable uploader
   ); 

  constructor() public {
  }
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    require(bytes(_fileHash).length>0);

    require(bytes(_fileHash).length>0);
    require(_fileSize>0);
    require(bytes(_fileType).length>0);
    require(bytes(_fileName).length>0);
    require(bytes(_fileDescription).length>0);
    require(msg.sender!=address(0));


    fileCount++;
    
    files[fileCount]=File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
    // Make sure the file hash exists

    // Make sure file type exists

    // Make sure file description exists

    // Make sure file fileName exists

    // Make sure uploader address exists

    // Make sure file size is more than 0


    // Increment file id

    // Add File to the contract

    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }
  

   

}